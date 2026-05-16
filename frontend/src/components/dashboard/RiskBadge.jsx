import { motion } from "framer-motion";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

const riskConfig = {
  LOW: {
    icon: ShieldCheck,
    color: "#10b981",
    label: "LOW RISK",
    glow: "0 0 30px rgba(16, 185, 129, 0.4), 0 0 60px rgba(16, 185, 129, 0.15)",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.3)",
  },
  MEDIUM: {
    icon: Shield,
    color: "#eab308",
    label: "MEDIUM RISK",
    glow: "0 0 30px rgba(234, 179, 8, 0.4), 0 0 60px rgba(234, 179, 8, 0.15)",
    bg: "rgba(234, 179, 8, 0.1)",
    border: "rgba(234, 179, 8, 0.3)",
  },
  CRITICAL: {
    icon: ShieldAlert,
    color: "#ef4444",
    label: "CRITICAL",
    glow: "0 0 30px rgba(239, 68, 68, 0.5), 0 0 60px rgba(239, 68, 68, 0.2)",
    bg: "rgba(239, 68, 68, 0.15)",
    border: "rgba(239, 68, 68, 0.4)",
  },
};

export default function RiskBadge({ level = "LOW" }) {
  const config = riskConfig[level] || riskConfig.LOW;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-xl p-4 text-center overflow-hidden"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        boxShadow: config.glow,
      }}
    >
      {level === "CRITICAL" && (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.3), transparent)`,
          }}
        />
      )}

      <div className="relative z-10">
        <motion.div
          animate={level === "CRITICAL" ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center mb-2"
        >
          <Icon
            className="w-10 h-10"
            style={{ color: config.color, filter: `drop-shadow(0 0 10px ${config.color})` }}
          />
        </motion.div>

        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Fused Risk Level</p>
        <motion.p
          className="text-2xl font-bold tracking-wider"
          style={{
            color: config.color,
            textShadow: `0 0 20px ${config.color}60`,
          }}
          animate={level === "CRITICAL" ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {config.label}
        </motion.p>
      </div>
    </motion.div>
  );
}
