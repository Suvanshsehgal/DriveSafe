import { motion } from "framer-motion";

export default function ProgressBar({
  value = 0,
  label = "",
  showValue = true,
  color = "#00d4ff",
  className = "",
  size = "md",
}) {
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-white/60 uppercase tracking-wider">{label}</span>}
          {showValue && (
            <span className="text-xs font-mono" style={{ color }}>
              {Math.round(value * 100)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${heights[size]} rounded-full bg-white/5 overflow-hidden relative`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`${heights[size]} rounded-full relative`}
          style={{
            background: `linear-gradient(90deg, ${color}40, ${color})`,
            boxShadow: `0 0 10px ${color}40, 0 0 20px ${color}20`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
              backgroundSize: "200% 100%",
              animation: "shimmer 2s linear infinite",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
