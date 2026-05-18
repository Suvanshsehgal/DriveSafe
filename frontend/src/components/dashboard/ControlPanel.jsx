import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Square, RotateCcw, Camera, Monitor, Upload, Check, X } from "lucide-react";
import GlowingButton from "../ui/GlowingButton";
import { uploadVideos } from "../../services/api";

export default function ControlPanel({ onUploadComplete, onRun, onStop, onReset, isProcessing }) {
  const [roadVideo, setRoadVideo] = useState(null);
  const [cabinVideo, setCabinVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  
  const roadVideoRef = useRef(null);
  const cabinVideoRef = useRef(null);

  const handleFileSelect = (type, file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('video/')) {
      setUploadError(`Please select a video file for ${type} video`);
      return;
    }
    
    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setUploadError(`File too large. Maximum size is 100MB for ${type} video`);
      return;
    }
    
    if (type === 'road') {
      setRoadVideo(file);
    } else {
      setCabinVideo(file);
    }
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!roadVideo || !cabinVideo) {
      setUploadError('Please select both road and cabin videos');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      // Upload videos to backend
      const result = await uploadVideos(roadVideo, cabinVideo);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setSessionId(result.session_id);
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(result);
      }
      
      // Reset progress after delay
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
      
    } catch (error) {
      setUploadError(`Upload failed: ${error.message}`);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    setRoadVideo(null);
    setCabinVideo(null);
    setSessionId(null);
    setUploadError(null);
    setUploadProgress(0);
    
    if (roadVideoRef.current) roadVideoRef.current.value = '';
    if (cabinVideoRef.current) cabinVideoRef.current.value = '';
    
    if (onReset) onReset();
  };

  const UploadZone = ({ type, label, Icon, file, inputRef }) => (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: "rgba(0, 212, 255, 0.5)" }}
      className="relative p-4 rounded-xl border-2 border-dashed border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer group"
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(type, e.target.files[0])}
      />
      
      <div className="text-center">
        {file ? (
          <div className="flex items-center justify-center gap-2 mb-2">
            <Check className="w-6 h-6 text-neon-green" />
          </div>
        ) : (
          <Icon className="w-8 h-8 mx-auto mb-2 text-white/30 group-hover:text-neon-blue transition-colors" />
        )}
        
        <p className="text-xs text-white/40 font-mono font-body">
          {file ? `${file.name.substring(0, 20)}...` : label}
        </p>
        
        {file ? (
          <p className="text-[10px] text-neon-green mt-1 font-body">
            {(file.size / (1024 * 1024)).toFixed(1)} MB
          </p>
        ) : (
          <p className="text-[10px] text-white/20 mt-1 font-body">
            Click or drag to upload
          </p>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: "#00d4ff",
            boxShadow: "0 0 8px #00d4ff",
            animation: "pulse-glow 1.5s ease-in-out infinite",
          }}
        />
        <span className="text-xs text-white/60 uppercase tracking-widest font-medium font-body">Control Panel</span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-white/40 mb-2 font-mono">INPUTS</p>
          <div className="grid grid-cols-1 gap-2">
            <UploadZone 
              type="road" 
              label="Road Video" 
              Icon={Monitor} 
              file={roadVideo}
              inputRef={roadVideoRef}
            />
            <UploadZone 
              type="cabin" 
              label="Cabin Video" 
              Icon={Camera} 
              file={cabinVideo}
              inputRef={cabinVideoRef}
            />
          </div>
        </div>

        {uploadError && (
          <div className="p-2 rounded-lg bg-neon-red/10 border border-neon-red/30">
            <p className="text-xs text-neon-red font-body flex items-center gap-1">
              <X className="w-3 h-3" /> {uploadError}
            </p>
          </div>
        )}

        {uploading && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-white/40">
              <span className="font-body">Uploading...</span>
              <span className="font-mono">{uploadProgress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan"
              />
            </div>
          </div>
        )}

        {sessionId && !uploading && (
          <div className="p-2 rounded-lg bg-neon-green/10 border border-neon-green/30">
            <p className="text-xs text-neon-green font-body flex items-center gap-1">
              <Check className="w-3 h-3" /> Videos uploaded successfully
            </p>
            <p className="text-[10px] text-white/40 font-mono mt-1">
              Session: {sessionId.substring(0, 8)}...
            </p>
          </div>
        )}

        <div>
          <p className="text-xs text-white/40 mb-2 font-mono">CONTROLS</p>
          <div className="grid grid-cols-2 gap-2">
            <GlowingButton
              variant={roadVideo && cabinVideo ? "success" : "outline"}
              className="flex items-center justify-center gap-1.5 text-xs !px-3 !py-2.5"
              onClick={handleUpload}
              disabled={!roadVideo || !cabinVideo || uploading}
            >
              <Upload className="w-3.5 h-3.5" />
              {uploading ? "Uploading..." : "Upload Videos"}
            </GlowingButton>
            
            <GlowingButton
              variant="outline"
              className="flex items-center justify-center gap-1.5 text-xs !px-3 !py-2.5"
              onClick={handleReset}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </GlowingButton>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <GlowingButton
              variant="success"
              className="flex items-center justify-center gap-1.5 text-xs !px-3 !py-2.5"
              onClick={onRun}
              disabled={!sessionId || isProcessing}
            >
              <Play className="w-3.5 h-3.5" />
              {isProcessing ? "Processing..." : "Run Analysis"}
            </GlowingButton>
            
            <GlowingButton
              variant="danger"
              className="flex items-center justify-center gap-1.5 text-xs !px-3 !py-2.5"
              onClick={onStop}
              disabled={!isProcessing}
            >
              <Square className="w-3.5 h-3.5" />
              Stop
            </GlowingButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
