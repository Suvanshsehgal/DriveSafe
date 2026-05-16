import { motion } from "framer-motion";
import GlassCard from "../ui/GlassCard";

export default function ProblemCard({ icon: Icon, title, description, stat, color = "#00d4ff", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard
        glowColor={`${color}15`}
        hoverGlow={`${color}30`}
        className="group h-full"
      >
        <div className="relative">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
            style={{
              background: `${color}20`,
              boxShadow: `0 0 20px ${color}20`,
            }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>

          <p className="text-sm text-white/50 leading-relaxed mb-4">{description}</p>

          {stat && (
            <div
              className="inline-block px-3 py-1 rounded-lg text-xs font-mono font-bold"
              style={{
                background: `${color}15`,
                color,
                border: `1px solid ${color}30`,
              }}
            >
              {stat}
            </div>
          )}

          <div
            className="absolute -top-1 -right-1 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-3xl pointer-events-none"
            style={{ background: `${color}10` }}
          />
        </div>
      </GlassCard>
    </motion.div>
  );
}
