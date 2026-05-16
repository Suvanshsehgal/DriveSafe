import { motion } from "framer-motion";
import { Camera, Box, Mountain, Activity, GitMerge, ShieldAlert, Brain, Merge, Eye } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import GlassCard from "../components/ui/GlassCard";

/* ─── Inline keyframes injected once ─── */
const flowStyles = `
  @keyframes flowDash {
    from { stroke-dashoffset: 24; }
    to   { stroke-dashoffset: 0;  }
  }
  .flow-line {
    stroke-dasharray: 6 4;
    animation: flowDash 0.8s linear infinite;
  }
`;

function PipelineNode({ icon: Icon, label, sub, color = "#00d4ff", delay = 0, side = "left" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="w-full"
    >
      <div
        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}25`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white font-subheading">{label}</p>
          {sub && (
            <p className="text-[10px] text-white/35 font-mono uppercase tracking-wider mt-0.5">
              {sub}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Arrow({ color = "#00d4ff", delay = 0, label = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.3 }}
      className="flex flex-col items-center py-1"
    >
      <div className="w-px h-5" style={{ background: `linear-gradient(to bottom, ${color}60, ${color}30)` }} />
      {label && (
        <div
          className="px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase whitespace-nowrap my-0.5"
          style={{ background: `${color}12`, color, border: `1px solid ${color}20` }}
        >
          {label}
        </div>
      )}
      <div
        className="w-0 h-0"
        style={{
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `6px solid ${color}`,
        }}
      />
    </motion.div>
  );
}

export default function ArchitectureSection() {
  const roadColor = "#22d3ee";
  const driverColor = "#7c3aed";

  return (
    <section id="architecture" className="relative py-24 md:py-32 overflow-hidden">
      {/* Inject animation keyframes */}
      <style>{flowStyles}</style>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="How It Works"
          subtitle="Two independent neural pipelines run in parallel — road perception and driver state — fused by a real-time risk classifier."
          glowColor="#00d4ff"
        />

        <div className="mt-16 grid lg:grid-cols-[1fr_180px_1fr] gap-4 items-start">

          {/* LEFT: Road Stream */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-5"
            style={{ border: `1px solid rgba(34,211,238,0.12)`, background: "rgba(34,211,238,0.02)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: roadColor }}>
                Stream 01 · Road
              </span>
              <span className="text-xs text-white/30">Forward-facing</span>
            </div>
            <div className="flex flex-col items-stretch gap-0">
              <PipelineNode icon={Camera} label="Road Camera" sub="1080p · 30 fps" color={roadColor} delay={0} side="left" />
              <Arrow color={roadColor} delay={0.1} label="" />
              <PipelineNode icon={Box} label="YOLO11m Detection" sub="vehicles · cattle · pedestrians" color={roadColor} delay={0.15} side="left" />
              <Arrow color={roadColor} delay={0.2} label="" />
              <PipelineNode icon={Mountain} label="MiDaS Depth" sub="monocular depth estimation" color={roadColor} delay={0.25} side="left" />
              <Arrow color={roadColor} delay={0.3} label="" />
              <PipelineNode icon={ShieldAlert} label="" sub="0 — 100" color={roadColor} delay={0.35} side="left" />
            </div>
          </motion.div>

          {/* CENTER: Animated merging SVG */}
          <div className="hidden lg:flex flex-col items-center justify-center" style={{ paddingTop: "64px" }}>
            <svg width="160" height="260" viewBox="0 0 160 260" fill="none" overflow="visible">
              {/* Left curve — cyan, flows toward center */}
              <path
                className="flow-line"
                d="M 20 20 Q 80 20 80 130"
                stroke={roadColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Right curve — purple, flows toward center */}
              <path
                className="flow-line"
                d="M 140 20 Q 80 20 80 130"
                stroke={driverColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                style={{ animationDelay: "0.15s" }}
              />

              {/* Vertical down line — purple, flows downward */}
              <line
                className="flow-line"
                x1="80" y1="130" x2="80" y2="230"
                stroke={driverColor}
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              {/* Arrowhead */}
              <polygon points="80,248 73,232 87,232" fill={driverColor} />
            </svg>
          </div>

          {/* RIGHT: Driver Stream */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl p-5"
            style={{ border: `1px solid rgba(124,58,237,0.12)`, background: "rgba(124,58,237,0.02)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: driverColor }}>
                Stream 02 · Driver
              </span>
              <span className="text-xs text-white/30">Cabin-facing</span>
            </div>
            <div className="flex flex-col items-stretch gap-0">
              <PipelineNode icon={Camera} label="Cabin Camera" sub="IR · 60 fps" color={driverColor} delay={0} side="right" />
              <Arrow color={driverColor} delay={0.1} label="" />
              <PipelineNode icon={Eye} label="Facial Landmarks" sub="dlib · 68 points" color={driverColor} delay={0.15} side="right" />
              <Arrow color={driverColor} delay={0.2} label="" />
              <PipelineNode icon={Activity} label="EAR · MAR · PERCLOS" sub="biometric features" color={driverColor} delay={0.25} side="right" />
              <Arrow color={driverColor} delay={0.3} label="" />
              <PipelineNode icon={ShieldAlert} label="Driver State Score" sub="0 — 100" color={driverColor} delay={0.35} side="right" />
            </div>
          </motion.div>
        </div>

        {/* Merge connector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 flex justify-center"
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-px h-8"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(0,212,255,0.5))" }}
            />
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono"
              style={{
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.25)",
                color: "#00d4ff",
              }}
            >
              <Merge className="w-3.5 h-3.5" />
              Dual Stream Merge
            </div>
            <div
              className="w-px h-6"
              style={{ background: "linear-gradient(to bottom, rgba(0,212,255,0.5), rgba(0,212,255,0.9))" }}
            />
          </div>
        </motion.div>

        {/* Fusion Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-lg mx-auto"
        >
          <GlassCard
            glowColor="rgba(0,212,255,0.2)"
            hoverGlow="rgba(0,212,255,0.35)"
            className="text-center !p-8"
          >
            <div className="relative">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "rgba(0,212,255,0.15)",
                  border: "1px solid rgba(0,212,255,0.3)",
                  boxShadow: "0 0 30px rgba(0,212,255,0.15)",
                }}
              >
                <GitMerge className="w-7 h-7" style={{ color: "#00d4ff" }} />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Fusion Engine</h3>
              <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-2">
                weighted Bayesian fusion · risk classification
              </p>
              <p className="text-sm text-white/40 mb-6">
                60% Road Score + 40% Driver Score → Unified Risk Assessment
              </p>

              <div className="flex items-center justify-center gap-3">
                {[
                  { level: "LOW", color: "#10b981" },
                  { level: "MEDIUM", color: "#eab308" },
                  { level: "CRITICAL", color: "#ef4444" },
                ].map(({ level, color }) => (
                  <div
                    key={level}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-bold"
                    style={{
                      background: `${color}15`,
                      color,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    {level}
                  </div>
                ))}
              </div>

              <div
                className="absolute -inset-2 rounded-2xl opacity-30 blur-2xl pointer-events-none"
                style={{ background: "rgba(0,212,255,0.08)" }}
              />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}