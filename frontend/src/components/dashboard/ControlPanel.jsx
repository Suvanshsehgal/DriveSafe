import { motion } from "framer-motion";
import { Play, Square, RotateCcw, Camera, Monitor } from "lucide-react";
import GlowingButton from "../ui/GlowingButton";

export default function ControlPanel() {
  const uploadZone = (label, Icon) => (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: "rgba(0, 212, 255, 0.5)" }}
      className="relative p-4 rounded-xl border-2 border-dashed border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer group"
    >
      <div className="text-center">
        <Icon className="w-8 h-8 mx-auto mb-2 text-white/30 group-hover:text-neon-blue transition-colors" />
        <p className="text-xs text-white/40 font-mono font-body">{label}</p>
        <p className="text-[10px] text-white/20 mt-1 font-body">Click or drag to upload</p>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: "#00d4ff",
            boxShadow: "0 0 8px #00d4ff",
            animation: "pulse-glow 1.5s ease-in-out infinite",
          }}
        />
        <span className="text-xs text-white/60 uppercase tracking-widest font-medium font-body">Control Panel</span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-white/40 mb-2 font-mono">INPUTS</p>
          <div className="grid grid-cols-1 gap-2">
            {uploadZone("Road Video", Monitor)}
            {uploadZone("Cabin Video", Camera)}
          </div>
        </div>

        <div>
          <p className="text-xs text-white/40 mb-2 font-mono">CONTROLS</p>
          <div className="grid grid-cols-3 gap-2">
            <GlowingButton variant="success" className="flex items-center justify-center gap-1.5 text-xs !px-3 !py-2.5">
              <Play className="w-3.5 h-3.5" /> Run
            </GlowingButton>
            <GlowingButton variant="danger" className="flex items-center justify-center gap-1.5 text-xs !px-3 !py-2.5">
              <Square className="w-3.5 h-3.5" /> Stop
            </GlowingButton>
            <GlowingButton variant="outline" className="flex items-center justify-center gap-1.5 text-xs !px-3 !py-2.5">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </GlowingButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
