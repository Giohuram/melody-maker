import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, ArrowRight, Twitter, Instagram, Github, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/lyricwave-logo.png";

const CTA = () => {
  return (
    <>
      {/* Final CTA */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 sm:mb-8 border border-accent/30">
              <span className="text-accent text-xs sm:text-sm font-semibold">🎵 Commencez à créer aujourd'hui</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black mb-5 sm:mb-6 leading-tight">
              Votre Musique Mérite
              <br />
              <span className="gradient-text">des Visuels Viraux</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed px-2">
              Rejoignez des milliers d'artistes qui créent déjà des vidéos lyrics époustouflantes.
              Aucune carte bancaire requise. 3 vidéos gratuites, pour toujours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/create">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 font-semibold text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 gap-2 rounded-xl"
                >
                  <Zap className="w-5 h-5" />
                  Créer ma Première Vidéo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/feed">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary/40 text-primary hover:bg-primary/10 font-semibold text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 gap-2 rounded-xl"
                >
                  <Radio className="w-5 h-5" />
                  Explorer le Fil
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="LyricWave" className="w-8 h-8 object-contain" />
              <span className="font-heading font-bold text-xl gradient-text">LyricWave</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-foreground transition-colors">Conditions</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
              <Link to="/feed" className="hover:text-foreground transition-colors flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" />
                Fil d'actualité
              </Link>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
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
          <div className="mt-6 sm:mt-8 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/60">
            <span>© 2025 LyricWave. Transformez Votre Musique en Vidéos Lyrics Virales.</span>
            <span className="font-medium text-muted-foreground/80">
              ✨ Créé par{" "}
              <span className="gradient-text font-bold">Giovanni Huram</span>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CTA;
