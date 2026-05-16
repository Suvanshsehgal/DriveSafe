import { motion } from "framer-motion";
import { ArrowRight, Shield, Play, Radar } from "lucide-react";
import ParticleBackground from "../components/hero/ParticleBackground";
import GlowingButton from "../components/ui/GlowingButton";
import Navbar from "../components/layout/Navbar";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />

      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(0, 212, 255, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(124, 58, 237, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(0, 212, 255, 0.04) 0%, transparent 50%)
          `,
        }}
      />

      <Navbar />

      {/* Radar effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] pointer-events-none">
        <div
          className="w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "conic-gradient(from 0deg, transparent, #00d4ff, transparent, #7c3aed, transparent)",
            animation: "radar-sweep 4s linear infinite",
          }}
        />
      </div>

      {/* HUD corner decorations */}
      <div className="absolute top-24 left-8 z-[1] pointer-events-none hidden lg:block">
        <div className="flex items-start gap-2">
          <div className="w-12 h-px bg-neon-blue/40 mt-2" />
          <div className="w-px h-12 bg-neon-blue/40" />
        </div>
        <p className="text-[10px] text-neon-blue/30 font-mono mt-2 tracking-[0.2em] uppercase font-body">System Ready</p>
      </div>
      <div className="absolute top-24 right-8 z-[1] pointer-events-none hidden lg:block">
        <div className="flex items-start justify-end gap-2">
          <div className="w-px h-12 bg-neon-blue/40" />
          <div className="w-12 h-px bg-neon-blue/40 mt-2" />
        </div>
        <p className="text-[10px] text-neon-blue/30 font-mono mt-2 tracking-[0.2em] uppercase text-right font-body">AI v2.0</p>
      </div>
      <div className="absolute bottom-32 left-8 z-[1] pointer-events-none hidden lg:block">
        <div className="flex items-end gap-2">
          <div className="w-12 h-px bg-neon-blue/40 mb-2" />
          <div className="w-px h-12 bg-neon-blue/40" />
        </div>
      </div>
      <div className="absolute bottom-32 right-8 z-[1] pointer-events-none hidden lg:block">
        <div className="flex items-end justify-end gap-2">
          <div className="w-px h-12 bg-neon-blue/40" />
          <div className="w-12 h-px bg-neon-blue/40 mb-2" />
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
            style={{
              background: "rgba(0, 212, 255, 0.1)",
              border: "1px solid rgba(0, 212, 255, 0.2)",
              color: "#00d4ff",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#00d4ff",
                boxShadow: "0 0 6px #00d4ff",
                animation: "pulse-glow 1.5s ease-in-out infinite",
              }}
            />
            <span className="font-body">AI-Powered ADAS Platform</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 font-heading"
        >
          <span className="text-white">DriveSafe —</span>
          <br />
          <span
            className="bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple bg-clip-text text-transparent"
            style={{
              textShadow: "0 0 60px rgba(0, 212, 255, 0.3)",
            }}
          >
            Real-Time AI Driver Assistance for Indian Roads
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto mb-10 leading-relaxed font-body"
        >
          A dual-stream deep learning system that monitors both road hazards and driver fatigue in real time,
          purpose-built for the unique challenges of Indian driving conditions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#demo">
            <GlowingButton variant="primary" className="flex items-center gap-2 text-base !px-8 !py-3.5">
              <Play className="w-5 h-5" />
              Try Live Demo
            </GlowingButton>
          </a>
          <a href="#architecture">
            <GlowingButton variant="outline" className="flex items-center gap-2 text-base !px-8 !py-3.5">
              <Radar className="w-5 h-5" />
              Learn More
            </GlowingButton>
          </a>
        </motion.div>

        {/* Bottom HUD stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto"
        >
          {[
            { label: "Detection Rate", value: "99.2%", color: "#10b981" },
            { label: "Latency", value: "<30ms", color: "#22d3ee" },
            { label: "Indian Roads Trained", value: "50K+", color: "#00d4ff" },
            { label: "Risk Factors", value: "12", color: "#7c3aed" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold font-mono font-heading" style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}40` }}>
                {stat.value}
              </p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mt-1 font-body">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-body">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-neon-blue/40 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
