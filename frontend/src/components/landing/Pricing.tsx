import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Zap, Film, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Tous les formats (TikTok, YouTube, Instagram, Shorts)",
  "Tous les styles (Apple Music, Karaoké, Cinématique, etc.)",
  "Export HD 1080p",
  "Sans filigrane",
  "Synchronisation automatique",
  "Choix de polices",
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[300px] sm:h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-accent text-xs sm:text-sm font-semibold uppercase tracking-widest">Tarifs</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black mt-2 mb-4">
            Payez{" "}
            <span className="gradient-text">Par Vidéo</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto px-2">
            Pas d'abonnement. Pas d'engagement. Payez uniquement pour ce que vous créez.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto"
        >
          <div className="relative glass rounded-2xl p-8 sm:p-10 border border-primary/60 glow-primary">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                SIMPLE & TRANSPARENT
              </span>
            </div>

            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-4">
                <Film className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="mb-2">
                <span className="font-heading text-5xl sm:text-6xl font-black gradient-text">$2.99</span>
              </div>
              <p className="text-muted-foreground text-lg">par vidéo générée</p>
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link to="/create">
              <Button
                className="w-full bg-gradient-primary text-primary-foreground border-0 hover:opacity-90 font-semibold text-lg py-6 rounded-xl gap-2"
                size="lg"
              >
                <Sparkles className="w-5 h-5" />
                Créer Ma Vidéo
              </Button>
            </Link>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Paiement sécurisé · Aucun abonnement requis
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
