import { motion } from "framer-motion";
import {
  Moon,
  Smartphone,
  Car,
  Cat,
  EyeOff,
  TrendingUp,
} from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import ProblemCard from "../components/cards/ProblemCard";

const problems = [
  {
    icon: Moon,
    title: "Driver Fatigue",
    description: "Long hours on monotonous highways lead to microsleeps and reduced reaction time, causing thousands of preventable accidents.",
    stat: "20% of road accidents",
    color: "#7c3aed",
  },
  {
    icon: Smartphone,
    title: "Distracted Driving",
    description: "Phone usage, eating, or adjusting the radio diverts attention from the road for critical seconds at highway speeds.",
    stat: "25% of crash fatalities",
    color: "#ef4444",
  },
  {
    icon: Car,
    title: "Lane-less Indian Traffic",
    description: "Chaotic mixed traffic with vehicles, auto-rickshaws, and pedestrians sharing undefined lanes unpredictable movements.",
    stat: "1.5 lakh deaths/year",
    color: "#f97316",
  },
  {
    icon: Cat,
    title: "Cattle on Roads",
    description: "Stray cattle on highways at night create sudden, unavoidable hazards that standard ADAS systems fail to recognize.",
    stat: "50K+ cattle-related crashes",
    color: "#eab308",
  },
  {
    icon: EyeOff,
    title: "Poor Visibility Conditions",
    description: "Heavy fog, monsoon rains, and nighttime darkness drastically reduce driver visibility, especially on unlit highways.",
    stat: "30% of accidents at night",
    color: "#22d3ee",
  },
  {
    icon: TrendingUp,
    title: "Rising Accident Statistics",
    description: "India reports the highest road accident fatalities globally, with numbers increasing 5% year over year.",
    stat: "3X global average",
    color: "#ef4444",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="The Problem We Solve"
          subtitle="Indian roads present unique challenges that conventional ADAS systems aren't designed to handle. DriveSafe addresses these critical gaps."
          glowColor="#7c3aed"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((problem, i) => (
            <ProblemCard key={problem.title} {...problem} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
