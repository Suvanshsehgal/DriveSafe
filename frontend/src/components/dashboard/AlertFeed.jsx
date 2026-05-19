import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const typeConfig = {
  danger: { icon: AlertTriangle, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.2)" },
  warning: { icon: AlertCircle, color: "#eab308", bg: "rgba(234, 179, 8, 0.1)", border: "rgba(234, 179, 8, 0.2)" },
  info: { icon: Info, color: "#22d3ee", bg: "rgba(34, 211, 238, 0.1)", border: "rgba(34, 211, 238, 0.2)" },
};

export default function AlertFeed({ alerts = [] }) {
  // Default alerts if none provided
  const displayAlerts = alerts.length > 0 ? alerts.slice(0, 5) : [
    { id: 1, type: "info", message: "Upload road and cabin videos to begin analysis", time: "ready" },
    { id: 2, type: "info", message: "Click 'Upload Videos' to start", time: "ready" },
    { id: 3, type: "info", message: "Ensure backend server is running", time: "ready" },
  ];

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
          {displayAlerts.map((alert) => {
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
