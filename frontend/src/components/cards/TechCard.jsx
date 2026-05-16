import { motion } from "framer-motion";
import GlassCard from "../ui/GlassCard";

export default function TechCard({ icon: Icon, title, description, color = "#00d4ff", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay }}
    >
      <GlassCard
        glowColor={`${color}10`}
        hoverGlow={`${color}25`}
        className="group text-center h-full"
      >
        <div className="relative flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{
              background: `linear-gradient(135deg, ${color}20, ${color}05)`,
              border: `1px solid ${color}30`,
              boxShadow: `0 0 30px ${color}10`,
            }}
          >
            <Icon className="w-7 h-7" style={{ color }} />
          </div>

          <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
          <p className="text-xs text-white/50 leading-relaxed">{description}</p>

          <div
            className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl pointer-events-none"
            style={{ background: `${color}08` }}
          />
        </div>
      </GlassCard>
    </motion.div>
  );
}
