import { motion } from "framer-motion";

export default function SectionHeading({
  title,
  subtitle,
  glowColor = "#00d4ff",
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`text-center mb-16 ${className}`}
    >
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent"
        style={{
          textShadow: `0 0 40px ${glowColor}30`,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="flex justify-center mt-6">
        <div
          className="h-1 w-24 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
            boxShadow: `0 0 15px ${glowColor}60`,
          }}
        />
      </div>
    </motion.div>
  );
}
