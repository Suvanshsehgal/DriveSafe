import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "Architecture", href: "#architecture" },
  { label: "Tech Stack", href: "#techstack" },
  { label: "Live Demo", href: "#demo" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark-bg/80 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.a
            href="#home"
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <Shield className="w-7 h-7 text-neon-blue" />
              <div
                className="absolute inset-0 w-7 h-7 rounded-full"
                style={{
                  boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)",
                  animation: "pulse-glow 2s ease-in-out infinite",
                }}
              />
            </div>
            <span className="text-lg font-bold text-white tracking-tight font-heading">
              Drive<span className="text-neon-blue">Safe</span>
            </span>
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-sm text-white/60 hover:text-neon-blue transition-colors relative group font-body"
                whileHover={{ x: 2 }}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-neon-blue transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
            <motion.a
              href="#demo"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 212, 255, 0.3)" }}
              className="px-5 py-2 rounded-xl bg-neon-blue/20 border border-neon-blue/40 text-neon-blue text-sm font-medium backdrop-blur-md transition-all duration-300 hover:bg-neon-blue/30 font-body"
            >
              Launch Dashboard
            </motion.a>
          </div>

          <button
            className="md:hidden text-white/60 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-dark-bg/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-white/60 hover:text-neon-blue py-2 transition-colors font-body"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#demo"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-5 py-2.5 rounded-xl bg-neon-blue/20 border border-neon-blue/40 text-neon-blue text-sm font-medium font-body"
              >
                Launch Dashboard
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
