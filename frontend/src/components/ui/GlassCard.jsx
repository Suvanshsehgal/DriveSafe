import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  glowColor = "rgba(0, 212, 255, 0.15)",
  hoverGlow = "rgba(0, 212, 255, 0.3)",
  hover = true,
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative overflow-hidden rounded-2xl border border-white/10
        bg-white/5 backdrop-blur-xl p-6
        transition-all duration-300
        ${className}
      `}
      style={{
        boxShadow: `0 0 30px ${glowColor}, inset 0 0 30px rgba(0, 212, 255, 0.03)`,
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = `0 0 50px ${hoverGlow}, inset 0 0 30px rgba(0, 212, 255, 0.05)`;
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = `0 0 30px ${glowColor}, inset 0 0 30px rgba(0, 212, 255, 0.03)`;
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
