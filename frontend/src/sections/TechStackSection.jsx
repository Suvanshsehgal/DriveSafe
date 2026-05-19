import {
  Brain,
  Eye,
  Camera,
  Database,
  Map,
  CloudSun,
  Server,
  Code2,
  Palette,
  Wifi,
  BarChart3,
} from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import TechCard from "../components/cards/TechCard";

const techs = [
  { icon: Brain, title: "YOLO11m", description: "Ultralytics YOLO v11 medium for real-time object detection on Indian roads.", color: "#00d4ff" },
  { icon: Eye, title: "MiDaS", description: "Intel's monocular depth estimation for accurate distance perception from single camera.", color: "#22d3ee" },
  { icon: Camera, title: "MediaPipe Face Mesh", description: "Google's 468-point facial landmark tracking for driver state monitoring.", color: "#7c3aed" },
  { icon: Database, title: "BDD100K", description: "Berkeley DeepDrive dataset for diverse driving scene understanding.", color: "#f97316" },
  { icon: Map, title: "IDD Dataset", description: "Indian Driving Dataset — fine-grained annotations for Indian traffic conditions.", color: "#eab308" },
  { icon: CloudSun, title: "DAWN Dataset", description: "Weather-degraded image dataset for fog, rain, snow, and low-light training.", color: "#10b981" },
  { icon: Server, title: "FastAPI", description: "High-performance Python async framework powering the real-time WebSocket backend.", color: "#00d4ff" },
  { icon: Code2, title: "React + Vite", description: "Modern frontend stack with Vite's lightning-fast HMR and React 19.", color: "#22d3ee" },
  { icon: Palette, title: "Tailwind CSS", description: "Utility-first CSS framework with custom design system for futuristic UI.", color: "#06b6d4" }
];

export default function TechStackSection() {
  return (
    <section id="techstack" className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(0, 212, 255, 0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Tech Stack & Datasets"
          subtitle="Built on state-of-the-art deep learning models, trained on specialized Indian road datasets, and powered by a modern full-stack architecture."
          glowColor="#22d3ee"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {techs.map((tech, i) => (
            <TechCard key={tech.title} {...tech} delay={i * 0.04} />
          ))}
        </div>
      </div>
    </section>
  );
}
