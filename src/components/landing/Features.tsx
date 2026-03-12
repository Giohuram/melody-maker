import { motion } from "framer-motion";
import { Upload, FileText, Zap, Sliders, Eye, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Uploadez votre morceau",
    description: "Déposez votre fichier MP3, WAV ou M4A. On analyse l'audio et affiche un aperçu waveform.",
    color: "primary",
  },
  {
    icon: FileText,
    step: "02",
    title: "Ajoutez vos paroles",
    description: "Tapez ou collez vos lyrics. Importez depuis .txt ou .lrc. La détection intelligente s'occupe du reste.",
    color: "secondary",
  },
  {
    icon: Zap,
    step: "03",
    title: "Sync Automatique",
    description: "Notre IA analyse les silences et mappe intelligemment vos paroles aux moments parfaits.",
    color: "accent",
  },
  {
    icon: Sliders,
    step: "04",
    title: "Ajustement Manuel",
    description: "Utilisez la timeline visuelle pour glisser-déposer les points de sync. Mode Listen & Mark pour la précision.",
    color: "primary",
  },
  {
    icon: Eye,
    step: "05",
    title: "Aperçu & Personnalisation",
    description: "Choisissez templates, polices, couleurs et animations. Aperçu en temps réel exactement comme le résultat final.",
    color: "secondary",
  },
  {
    icon: Download,
    step: "06",
    title: "Exporter & Partager",
    description: "Générez votre vidéo pour TikTok, YouTube, Instagram ou Shorts. Partagez sur le fil d'actualité.",
    color: "accent",
  },
];

const features = [
  {
    title: "Sync Auto Intelligente",
    description: "Algorithme avancé de détection des silences qui mappe vos paroles à la musique automatiquement.",
    icon: "🎯",
  },
  {
    title: "Timeline Manuelle",
    description: "Timeline drag & drop avec mode Listen & Mark pour une synchronisation précise au frame près.",
    icon: "🎚️",
  },
  {
    title: "5 Formats d'Export",
    description: "Export pour TikTok (9:16), YouTube (16:9), YouTube Shorts, Instagram (1:1) — depuis un seul projet.",
    icon: "📱",
  },
  {
    title: "Mode Karaoké",
    description: "Surbrillance mot par mot qui crée l'effet karaoké ultime que votre audience adore.",
    icon: "🎤",
  },
  {
    title: "Fil d'Actualité",
    description: "Partagez vos vidéos et découvrez celles des autres artistes comme sur TikTok ou Suno AI.",
    icon: "📡",
  },
  {
    title: "Génération Côté Client",
    description: "Votre vidéo est générée directement dans votre navigateur — aucune file d'attente serveur.",
    icon: "⚡",
  },
];

const colorMap = {
  primary: "from-primary/20 to-primary/5 border-primary/30 text-primary",
  secondary: "from-secondary/20 to-secondary/5 border-secondary/30 text-secondary",
  accent: "from-accent/20 to-accent/5 border-accent/30 text-accent",
};

const Features = () => {
  return (
    <>
      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-widest">Comment ça marche</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black mt-2 mb-4">
              Du Morceau à la{" "}
              <span className="gradient-text">Vidéo Virale</span>
              <br />
              en 6 Étapes Simples
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto px-2">
              Le workflow de création de vidéos lyrics le plus fluide jamais conçu.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const colors = colorMap[step.color as keyof typeof colorMap];
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass rounded-2xl p-5 sm:p-6 border border-border/40 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 font-mono text-3xl sm:text-4xl font-black text-muted/30 select-none">
                    {step.step}
                  </div>
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${colors} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="text-secondary text-xs sm:text-sm font-semibold uppercase tracking-widest">Fonctionnalités</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black mt-2 mb-4">
              Tout ce qu'il faut pour{" "}
              <span className="gradient-text-accent">Devenir Viral</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feat, index) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="glass rounded-2xl p-5 sm:p-6 border border-border/40 hover:border-secondary/30 transition-all duration-300 group"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform inline-block">
                  {feat.icon}
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold mb-2">{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
