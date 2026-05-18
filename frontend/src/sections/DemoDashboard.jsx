import { useState, useEffect, useCallback, useRef, memo } from "react";
import { motion } from "framer-motion";
import { Shield, Wifi, Cpu, Activity, User, AlertTriangle } from "lucide-react";
import VideoPanel from "../components/dashboard/VideoPanel";
import ControlPanel from "../components/dashboard/ControlPanel";
import AlertFeed from "../components/dashboard/AlertFeed";
import RiskBadge from "../components/dashboard/RiskBadge";
import ScorePanel from "../components/analytics/ScorePanel";
import AnalyticsChart from "../components/charts/AnalyticsChart";
import GlassCard from "../components/ui/GlassCard";
import { webSocketService, checkBackendHealth } from "../services/api";

const StatusChip = memo(function StatusChip({ label, active = true, color = "#10b981" }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono"
      style={{
        background: active ? `${color}12` : "rgba(255,255,255,0.03)",
        border: `1px solid ${active ? `${color}30` : "rgba(255,255,255,0.08)"}`,
        color: active ? color : "rgba(255,255,255,0.3)",
      }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: color,
          boxShadow: active ? `0 0 6px ${color}` : "none",
          animation: active ? "pulse-glow 1.5s ease-in-out infinite" : "none",
        }}
      />
      {label}
    </div>
  );
});

const MetricBadge = memo(function MetricBadge({ icon: Icon, label, value, color = "#00d4ff" }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
      <Icon className="w-3 h-3" style={{ color }} />
      <span className="text-[10px] text-white/40 font-mono font-body">{label}</span>
      <span className="text-xs font-mono font-bold font-body" style={{ color }}>{value}</span>
    </div>
  );
});

export default function DemoDashboard() {
  const [backendConnected, setBackendConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentScores, setCurrentScores] = useState({
    road: 0.32,
    driver: 0.18,
    fused: 0.26
  });
  const [riskLevel, setRiskLevel] = useState("LOW");
  const [alerts, setAlerts] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [outputVideoUrl, setOutputVideoUrl] = useState(null);

  // Refs for high-frequency frame data (avoid React re-renders)
  const roadFrameRef = useRef(null);
  const driverFrameRef = useRef(null);
  const roadAnnotRef = useRef(null);
  const driverAnnotRef = useRef(null);
  const frameTickRef = useRef(0);
  const isProcessingRef = useRef(false);

  // Sync isProcessing to ref
  useEffect(() => { isProcessingRef.current = isProcessing; }, [isProcessing]);

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendConnected(isHealthy);
      if (isHealthy) webSocketService.connect();
    };
    checkHealth();
    webSocketService.onConnectionChange(setBackendConnected);

    const addAlertFn = (type, message, time) => {
      const alert = { id: Date.now(), type, message, time };
      setAlerts(prev => [alert, ...prev.slice(0, 4)]);
    };

    const handleWebSocketMessage = (data) => {
      if (data.status === "completed") {
        setIsProcessing(false);
        setIsPlaying(false);
        isProcessingRef.current = false;
        if (data.output_url) {
          setOutputVideoUrl(data.output_url);
        }
        addAlertFn("info", "Analysis complete. Output video ready.", "just now");
        return;
      }

      if (data.road_frame_annotated) {
        roadFrameRef.current = `data:image/jpeg;base64,${data.road_frame_annotated}`;
      }
      if (data.driver_frame_annotated) {
        driverFrameRef.current = `data:image/jpeg;base64,${data.driver_frame_annotated}`;
      }

      if (data.detections) {
        roadAnnotRef.current = { detections: data.detections.road || [] };
        driverAnnotRef.current = {
          landmarks: data.detections.driver?.landmarks || [],
          metrics: data.detections.driver?.metrics || {}
        };
      }

      // Only tick when we have frame data
      if (data.road_frame_annotated || data.driver_frame_annotated) {
        frameTickRef.current++;
      }

      if (data.road_score !== undefined && data.driver_score !== undefined && data.fused_score !== undefined) {
        setCurrentScores({
          road: data.road_score,
          driver: data.driver_score,
          fused: data.fused_score
        });
        setChartData(prev => {
          const pt = {
            time: `${prev.length}s`,
            road: data.road_score,
            driver: data.driver_score,
            fused: data.fused_score
          };
          return [...prev.slice(-19), pt];
        });
      }

      if (data.risk_level) {
        setRiskLevel(data.risk_level);
        if (data.risk_level === "CRITICAL") addAlertFn("danger", `Critical risk detected`, "just now");
        else if (data.risk_level === "MEDIUM") addAlertFn("warning", `Medium risk detected`, "just now");
      }

      if (isProcessingRef.current) {
        setCurrentTime(prev => prev + 0.033);
      }
    };

    webSocketService.onMessage(handleWebSocketMessage);

    return () => {
      webSocketService.removeMessageHandler(handleWebSocketMessage);
      webSocketService.removeConnectionHandler(setBackendConnected);
    };
  }, []);

  // Handle video playback
  useEffect(() => {
    let interval;
    
    if (isPlaying && isProcessing) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= videoDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isProcessing, videoDuration]);

  const addAlert = useCallback((type, message, time) => {
    const newAlert = {
      id: Date.now(),
      type,
      message,
      time
    };
    
    setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
  }, []);

  const handleUploadComplete = useCallback((result) => {
    setSessionId(result.session_id);
    setVideoDuration(result.duration || 30); // Use actual duration from backend
    setCurrentTime(0);
    
    addAlert("info", `Videos uploaded successfully. Session: ${result.session_id.substring(0, 8)}...`, "just now");
  }, [addAlert]);

  const handleRunAnalysis = useCallback(() => {
    if (!sessionId) {
      addAlert("warning", "Please upload videos first", "just now");
      return;
    }
    
    setIsProcessing(true);
    setIsPlaying(true);
    setCurrentTime(0);
    
    // Connect WebSocket with session ID
    webSocketService.connect(sessionId);
    
    addAlert("info", "Starting video analysis...", "just now");
    
    // Simulate processing start
    setTimeout(() => {
      addAlert("info", "Analysis in progress. Processing frames...", "2s ago");
    }, 2000);
  }, [sessionId, addAlert]);

  const handleStopAnalysis = useCallback(() => {
    setIsProcessing(false);
    setIsPlaying(false);
    addAlert("info", "Analysis stopped", "just now");
  }, [addAlert]);

  const handleReset = useCallback(() => {
    setIsProcessing(false);
    setIsPlaying(false);
    setSessionId(null);
    roadFrameRef.current = null;
    driverFrameRef.current = null;
    roadAnnotRef.current = null;
    driverAnnotRef.current = null;
    frameTickRef.current = 0;
    setCurrentTime(0);
    setChartData([]);
    setAlerts([]);
    
    webSocketService.disconnect();
  }, []);

  const handlePlayPause = (type) => {
    if (type === 'road' || type === 'driver') {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section id="demo" className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(0, 212, 255, 0.05) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 100%, rgba(124, 58, 237, 0.03) 0%, transparent 60%)
          `,
        }}
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-heading">
            <span className="text-white">Live</span>{" "}
            <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">Dashboard</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto font-body">
            Real-time AI inference dashboard. Upload your video feeds and see DriveSafe analyze road hazards and driver state simultaneously.
          </p>
        </motion.div>

        {/* Top bar */}
        <GlassCard className="!p-3 md:!p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-neon-blue" />
                <span className="text-sm font-bold text-white tracking-tight font-heading">
                  Drive<span className="text-neon-blue">Safe</span>
                </span>
              </div>
              <div className="hidden sm:block w-px h-5 bg-white/10" />
              <StatusChip label="System Online" color="#10b981" active={backendConnected} />
              <StatusChip label="AI Engine" color="#00d4ff" active={isProcessing} />
              {sessionId && (
                <StatusChip label="Session Active" color="#7c3aed" active={true} />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <MetricBadge 
                icon={Wifi} 
                label="WS" 
                value={backendConnected ? "Connected" : "Disconnected"} 
                color={backendConnected ? "#10b981" : "#ef4444"} 
              />
              <MetricBadge 
                icon={Cpu} 
                label="Inference" 
                value={isProcessing ? "30 FPS" : "0 FPS"} 
                color={isProcessing ? "#22d3ee" : "#666"} 
              />
              <MetricBadge 
                icon={Activity} 
                label="Status" 
                value={isProcessing ? "Processing" : "Idle"} 
                color={isProcessing ? "#7c3aed" : "#666"} 
              />
            </div>
          </div>
        </GlassCard>

        {/* Connection warning */}
        {!backendConnected && (
          <GlassCard className="!p-4 mb-6" glowColor="rgba(239, 68, 68, 0.1)">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-neon-red" />
              <div>
                <p className="text-sm text-white font-body">
                  Backend not connected. Please ensure the DriveSafe backend server is running.
                </p>
                <p className="text-xs text-white/50 font-body mt-1">
                  Run: <code className="bg-white/10 px-2 py-1 rounded">cd backend && python -m uvicorn app.main:app --reload</code>
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
          {/* Left: Control Panel */}
          <div className="xl:col-span-2">
            <GlassCard className="!p-4 h-full">
              <ControlPanel 
                onUploadComplete={handleUploadComplete}
                onRun={handleRunAnalysis}
                onStop={handleStopAnalysis}
                onReset={handleReset}
                isProcessing={isProcessing}
              />
            </GlassCard>
          </div>

          {/* Center: Video Panels */}
          <div className="xl:col-span-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <VideoPanel 
                title="Road View" 
                accent="#22d3ee"
                frameRef={roadFrameRef}
                annotRef={roadAnnotRef}
                tickRef={frameTickRef}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={videoDuration}
                onPlayPause={() => handlePlayPause('road')}
              />
              <VideoPanel 
                title="Driver View" 
                icon={User}
                accent="#7c3aed"
                frameRef={driverFrameRef}
                annotRef={driverAnnotRef}
                tickRef={frameTickRef}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={videoDuration}
                onPlayPause={() => handlePlayPause('driver')}
              />
            </div>
            
            {/* Bottom: Analytics Chart */}
            <AnalyticsChart data={chartData} />

            {/* Output video */}
            {outputVideoUrl && (
              <GlassCard className="!p-4" glowColor="rgba(0, 212, 255, 0.1)">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-neon-green" />
                  <span className="text-sm font-bold text-white font-heading">Processed Output</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/30 font-mono">COMPLETE</span>
                </div>
                <div className="relative rounded-xl overflow-hidden bg-black/40">
                  <video
                    className="w-full aspect-video"
                    controls
                    autoPlay
                    src={`http://localhost:8000${outputVideoUrl}`}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Right: Analytics + Alerts */}
          <div className="xl:col-span-4 space-y-4">
            <GlassCard className="!p-4">
              <ScorePanel 
                roadScore={currentScores.road}
                driverScore={currentScores.driver}
                fusedScore={currentScores.fused}
              />
            </GlassCard>

            <GlassCard className="!p-4" glowColor="rgba(239, 68, 68, 0.1)">
              <RiskBadge level={riskLevel} />
            </GlassCard>

            <GlassCard className="!p-4" glowColor="rgba(234, 179, 8, 0.08)">
              <AlertFeed alerts={alerts} />
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
