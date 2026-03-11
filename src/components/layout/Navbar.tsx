import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Music2, Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/lyricwave-logo.png";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const navLinks = isLanding
    ? [
        { label: "Features", href: "#features" },
        { label: "How it Works", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
      ]
    : [];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-heavy border-b border-border/30"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src={logoImg} alt="LyricWave" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-heading font-bold text-xl gradient-text">LyricWave</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
          {!isLanding && (
            <Link
              to="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isLanding ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link to="/create">
                <Button size="sm" className="bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 transition-opacity font-semibold gap-2">
                  <Zap className="w-4 h-4" />
                  Start Free
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/create">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 transition-opacity font-semibold gap-2">
                <Zap className="w-4 h-4" />
                New Project
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-heavy border-t border-border/30 px-6 py-4 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
          <Link to="/create" onClick={() => setMobileOpen(false)}>
            <Button className="w-full bg-gradient-primary text-primary-foreground border-0 font-semibold gap-2">
              <Zap className="w-4 h-4" />
              Start Free
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
