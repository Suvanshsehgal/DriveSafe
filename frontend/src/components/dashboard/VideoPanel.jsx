import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Play, Pause } from "lucide-react";

export default function VideoPanel({
  title,
  icon: Icon = Camera,
  accent = "#00d4ff",
  frameRef = null,
  annotRef = null,
  tickRef = null,
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  onPlayPause
}) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const rafRef = useRef(null);
  const hasFrameRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);

  useEffect(() => {
    let prevTick = -1;
    let prevAnnot = null;
    let image = null;

    const decodeAndDraw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const img = imageRef.current;
      if (!img || !img.naturalWidth) return;

      const parent = canvas.parentElement;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      ctx.drawImage(img, 0, 0, w, h);

      const annot = annotRef?.current;
      if (annot) {
        const sx = w / img.naturalWidth;
        const sy = h / img.naturalHeight;

        if (annot.detections && Array.isArray(annot.detections)) {
          annot.detections.forEach((det) => {
            const [x1, y1, x2, y2] = det.bbox;
            const color = det.color || accent;
            const label = det.class_name || det.label || "";
            const conf = det.confidence || 0;

            const rx = x1 * sx;
            const ry = y1 * sy;
            const rw = (x2 - x1) * sx;
            const rh = (y2 - y1) * sy;

            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeRect(rx, ry, rw, rh);

            ctx.font = "12px monospace";
            const txt = `${label} ${(conf * 100).toFixed(0)}%`;
            const tw = ctx.measureText(txt).width + 10;
            ctx.fillStyle = `${color}CC`;
            ctx.fillRect(rx, ry - 22, tw, 22);
            ctx.fillStyle = "#ffffff";
            ctx.fillText(txt, rx + 5, ry - 7);
          });
        }

        if (annot.landmarks && Array.isArray(annot.landmarks)) {
          ctx.fillStyle = "#00ff00";
          annot.landmarks.forEach(([lx, ly]) => {
            ctx.beginPath();
            ctx.arc(lx * sx, ly * sy, 2, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      }
    };

    const loadFrame = (src) => {
      if (!image) image = new Image();
      image.onload = () => {
        imageRef.current = image;
        if (!hasFrameRef.current) {
          hasFrameRef.current = true;
          setHasFrame(true);
        }
        decodeAndDraw();
      };
      image.src = src;
    };

    const loop = () => {
      const tick = tickRef?.current ?? 0;
      if (tick !== prevTick) {
        const src = frameRef?.current;
        if (src) {
          loadFrame(src);
        }
        prevTick = tick;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      image = null;
    };
  }, [accent, tickRef, frameRef, annotRef]);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accent}, transparent 70%)`,
        }}
      />

      <div className="relative aspect-video bg-black/40 overflow-hidden">
        {hasFrame ? (
          <>
            <canvas ref={canvasRef} className="w-full h-full block" />

            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                <button
                  onClick={onPlayPause}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>
              </motion.div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${(currentTime / duration) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
              >
                <Icon className="w-8 h-8" style={{ color: accent }} />
              </div>
              <p className="text-sm text-white/30 font-mono font-body">{title} Feed</p>
              <p className="text-xs text-white/20 mt-2 font-body">Upload video to begin analysis</p>
            </div>
          </div>
        )}

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
              background: hasFrame ? accent : "#666",
              boxShadow: hasFrame ? `0 0 8px ${accent}` : "none",
              animation: hasFrame ? "pulse-glow 1.5s ease-in-out infinite" : "none",
            }}
          />
          <span className="text-xs text-white/50 font-mono font-body">
            {hasFrame ? "LIVE" : "OFFLINE"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {hasFrame && (
            <>
              <span className="text-xs text-white/30 font-mono font-body">
                {fmt(currentTime)} / {fmt(duration)}
              </span>
              <span className="text-xs text-white/30 font-mono font-body">
                AI: <span style={{ color: hasFrame ? accent : "#666" }}>
                  {hasFrame ? "ACTIVE" : "INACTIVE"}
                </span>
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
