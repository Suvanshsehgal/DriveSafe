import HeroSection from "../sections/HeroSection";
import ProblemSection from "../sections/ProblemSection";
import ArchitectureSection from "../sections/ArchitectureSection";
import TechStackSection from "../sections/TechStackSection";
import DemoDashboard from "../sections/DemoDashboard";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProblemSection />
      <ArchitectureSection />
      <TechStackSection />
      <DemoDashboard />
    </main>
  );
}
