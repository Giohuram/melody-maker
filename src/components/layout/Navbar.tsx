import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Zap, Radio, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/lyricwave-logo.png";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isAuth = location.pathname === "/auth";

  const navLinks = isLanding
    ? [
        { label: "Fonctionnalités", href: "#features" },
        { label: "Comment ça marche", href: "#how-it-works" },
        { label: "Tarifs", href: "#pricing" },
      ]
    : [];

  if (isAuth) return null;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-heavy border-b border-border/30"
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src={logoImg} alt="LyricWave" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-heading font-bold text-lg sm:text-xl gradient-text">LyricWave</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
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
            <>
              <Link
                to="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Mes Projets
              </Link>
              <Link
                to="/feed"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium flex items-center gap-1"
              >
                <Radio className="w-3.5 h-3.5" />
                Fil d'actualité
              </Link>
              <Link
                to="/docs/backend"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Docs API
              </Link>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isLanding ? (
            <>
              <Link to="/feed">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
                  <Radio className="w-4 h-4" />
                  Fil
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Connexion
                </Button>
              </Link>
              <Link to="/create">
                <Button size="sm" className="bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 transition-opacity font-semibold gap-2">
                  <Zap className="w-4 h-4" />
                  Commencer
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/create">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 transition-opacity font-semibold gap-2">
                <Zap className="w-4 h-4" />
                Nouveau Projet
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-2"
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
          className="md:hidden glass-heavy border-t border-border/30 px-4 py-4 flex flex-col gap-3"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
            >
              {link.label}
            </a>
          ))}
          {!isLanding && (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground text-sm font-medium py-2">
                Mes Projets
              </Link>
              <Link to="/feed" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground text-sm font-medium py-2 flex items-center gap-2">
                <Radio className="w-4 h-4" />
                Fil d'actualité
              </Link>
              <Link to="/docs/backend" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground text-sm font-medium py-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Docs API
              </Link>
            </>
          )}
          {isLanding && (
            <Link to="/feed" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full border-border/60 gap-2">
                <Radio className="w-4 h-4" />
                Fil d'actualité
              </Button>
            </Link>
          )}
          <Link to="/auth" onClick={() => setMobileOpen(false)}>
            <Button variant="outline" className="w-full border-border/60">
              Connexion / Inscription
            </Button>
          </Link>
          <Link to="/create" onClick={() => setMobileOpen(false)}>
            <Button className="w-full bg-gradient-primary text-primary-foreground border-0 font-semibold gap-2">
              <Zap className="w-4 h-4" />
              Commencer Gratuitement
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
