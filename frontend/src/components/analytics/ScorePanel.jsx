import { motion } from "framer-motion";
import ProgressBar from "../ui/ProgressBar";

export default function ScorePanel() {
  const scores = [
    { label: "Road Hazard Score", value: 0.32, color: "#22d3ee" },
    { label: "Driver State Score", value: 0.18, color: "#10b981" },
    { label: "Fused Score", value: 0.26, color: "#00d4ff" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: "#00d4ff",
            boxShadow: "0 0 8px #00d4ff",
            animation: "pulse-glow 1.5s ease-in-out infinite",
          }}
        />
        <span className="text-xs text-white/60 uppercase tracking-widest font-medium font-body">Live Scores</span>
      </div>

      <div className="space-y-4">
        {scores.map((score, i) => (
          <motion.div
            key={score.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <ProgressBar
              label={score.label}
              value={score.value}
              color={score.color}
              size="md"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
