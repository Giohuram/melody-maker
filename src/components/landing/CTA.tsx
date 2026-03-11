import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, ArrowRight, Music2, Github, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/lyricwave-logo.png";

const CTA = () => {
  return (
    <>
      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 border border-accent/30">
              <span className="text-accent text-sm font-semibold">🎵 Start creating today</span>
            </div>
            <h2 className="font-heading text-5xl md:text-6xl font-black mb-6 leading-tight">
              Your Music Deserves
              <br />
              <span className="gradient-text">Viral Visuals</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Join thousands of artists already creating stunning lyrics videos.
              No credit card required. 3 free videos, forever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/create">
                <Button
                  size="lg"
                  className="bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 font-semibold text-lg px-10 py-7 gap-2 rounded-xl"
                >
                  <Zap className="w-5 h-5" />
                  Create Your First Video
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="LyricWave" className="w-8 h-8 object-contain" />
              <span className="font-heading font-bold text-xl gradient-text">LyricWave</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="w-9 h-9 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border/40">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border/40">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border/40">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-muted-foreground/60">
            © 2025 LyricWave. Transform Your Music Into Viral Lyrics Videos.
          </div>
        </div>
      </footer>
    </>
  );
};

export default CTA;
