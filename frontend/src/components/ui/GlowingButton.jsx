import { motion } from "framer-motion";

export default function GlowingButton({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled = false,
  ...props
}) {
  const variants = {
    primary:
      "bg-neon-blue/20 text-neon-blue border-neon-blue/40 hover:bg-neon-blue/30",
    danger:
      "bg-neon-red/20 text-neon-red border-neon-red/40 hover:bg-neon-red/30",
    warning:
      "bg-neon-yellow/20 text-neon-yellow border-neon-yellow/40 hover:bg-neon-yellow/30",
    success:
      "bg-neon-green/20 text-neon-green border-neon-green/40 hover:bg-neon-green/30",
    outline:
      "bg-transparent text-white/70 border-white/20 hover:bg-white/5 hover:text-white",
  };

  const glowVariants = {
    primary: "0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)",
    danger: "0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1)",
    warning: "0 0 20px rgba(234, 179, 8, 0.3), 0 0 40px rgba(234, 179, 8, 0.1)",
    success: "0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)",
    outline: "none",
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 rounded-xl border font-body
        backdrop-blur-md transition-all duration-300
        disabled:opacity-40 disabled:cursor-not-allowed
        cursor-pointer text-sm tracking-wide
        ${variants[variant]} ${className}
      `}
      style={{
        boxShadow: glowVariants[variant],
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
