import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const sampleAlerts = [
  { id: 1, type: "danger", message: "Cattle detected nearby — 15m ahead", time: "just now" },
  { id: 2, type: "warning", message: "Driver yawning detected — fatigue risk", time: "2s ago" },
  { id: 3, type: "danger", message: "Vehicle approaching rapidly — collision risk", time: "4s ago" },
  { id: 4, type: "warning", message: "Driver distracted — phone detected", time: "7s ago" },
  { id: 5, type: "info", message: "Road hazard: pothole ahead", time: "10s ago" },
  { id: 6, type: "warning", message: "Lane departure warning", time: "13s ago" },
  { id: 7, type: "danger", message: "Pedestrian jaywalking detected", time: "16s ago" },
  { id: 8, type: "info", message: "Low visibility — fog ahead", time: "20s ago" },
];

const typeConfig = {
  danger: { icon: AlertTriangle, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.2)" },
  warning: { icon: AlertCircle, color: "#eab308", bg: "rgba(234, 179, 8, 0.1)", border: "rgba(234, 179, 8, 0.2)" },
  info: { icon: Info, color: "#22d3ee", bg: "rgba(34, 211, 238, 0.1)", border: "rgba(34, 211, 238, 0.2)" },
};

export default function AlertFeed() {
  const [alerts, setAlerts] = useState(sampleAlerts.slice(0, 4));

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) => {
        const next = sampleAlerts[prev.length % sampleAlerts.length];
        return [next, ...prev].slice(0, 5);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: "#ef4444",
            boxShadow: "0 0 8px #ef4444",
            animation: "pulse-glow 1s ease-in-out infinite",
          }}
        />
        <span className="text-xs text-white/60 uppercase tracking-widest font-medium font-body">Live Alerts</span>
      </div>

      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => {
            const config = typeConfig[alert.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: 30, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: -30, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-2.5 p-2.5 rounded-lg text-xs"
                style={{
                  background: config.bg,
                  border: `1px solid ${config.border}`,
                }}
              >
                <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: config.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 leading-relaxed font-body">{alert.message}</p>
                  <p className="text-[10px] text-white/30 mt-0.5 font-mono font-body">{alert.time}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
