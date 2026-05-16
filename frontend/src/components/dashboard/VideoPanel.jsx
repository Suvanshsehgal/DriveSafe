import { motion } from "framer-motion";
import { Camera, Video } from "lucide-react";

export default function VideoPanel({ title, icon: Icon = Camera, accent = "#00d4ff" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden bg-black/60 backdrop-blur-sm border"
      style={{
        borderColor: `${accent}30`,
        boxShadow: `0 0 30px ${accent}10, inset 0 0 60px rgba(0,0,0,0.5)`,
        animation: "border-glow 3s ease-in-out infinite",
      }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accent}, transparent 70%)`,
        }}
      />

      <div className="relative aspect-video flex items-center justify-center bg-black/40">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
          >
            <Icon className="w-8 h-8" style={{ color: accent }} />
          </div>
          <p className="text-sm text-white/30 font-mono font-body">{title} Feed</p>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              animation: "scan-line 3s linear infinite",
              boxShadow: `0 0 10px ${accent}`,
            }}
          />
        </div>
      </div>

      <div className="px-4 py-2 flex items-center justify-between bg-black/40 border-t" style={{ borderColor: `${accent}15` }}>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: accent,
              boxShadow: `0 0 8px ${accent}`,
              animation: "pulse-glow 1.5s ease-in-out infinite",
            }}
          />
          <span className="text-xs text-white/50 font-mono font-body">LIVE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30 font-mono font-body">AI: <span style={{ color: accent }}>ACTIVE</span></span>
          <span className="text-xs text-white/30 font-mono font-body">FPS: 30</span>
        </div>
      </div>
    </motion.div>
  );
}
