import { motion } from "framer-motion";
import { Upload, FileText, Zap, Sliders, Eye, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Track",
    description: "Drop your MP3, WAV, or M4A file. We'll analyze the audio and display a beautiful waveform preview.",
    color: "primary",
  },
  {
    icon: FileText,
    step: "02",
    title: "Add Your Lyrics",
    description: "Type or paste your lyrics. Import from .txt or .lrc files. Smart line detection handles the rest.",
    color: "secondary",
  },
  {
    icon: Zap,
    step: "03",
    title: "Auto-Sync Magic",
    description: "Our AI analyzes silence patterns and intelligently maps your lyrics to the perfect moments.",
    color: "accent",
  },
  {
    icon: Sliders,
    step: "04",
    title: "Fine-Tune Manually",
    description: "Use the visual timeline to drag & drop sync points. Listen & mark mode for precision control.",
    color: "primary",
  },
  {
    icon: Eye,
    step: "05",
    title: "Preview & Customize",
    description: "Pick templates, fonts, colors, and animations. Real-time preview exactly as it'll look.",
    color: "secondary",
  },
  {
    icon: Download,
    step: "06",
    title: "Export & Share",
    description: "Generate your video for TikTok, YouTube, Instagram, or Shorts. Ready to go viral.",
    color: "accent",
  },
];

const features = [
  {
    title: "Smart Auto-Sync",
    description: "Advanced silence detection algorithm maps your lyrics to the music automatically with high accuracy.",
    icon: "🎯",
  },
  {
    title: "Manual Timeline",
    description: "Drag & drop timeline with Listen & Mark mode for frame-perfect lyric synchronization.",
    icon: "🎚️",
  },
  {
    title: "Multiple Formats",
    description: "Export for TikTok (9:16), YouTube (16:9), Instagram (1:1), and YouTube Shorts — all from one project.",
    icon: "📱",
  },
  {
    title: "Karaoke Mode",
    description: "Word-by-word highlighting creates the ultimate karaoke effect your audience loves.",
    icon: "🎤",
  },
  {
    title: "Premium Templates",
    description: "Curated templates for Hip-Hop, Pop, R&B, Afrobeat, Rock, and more genres.",
    icon: "🎨",
  },
  {
    title: "Client-Side Generation",
    description: "Your video is generated directly in your browser — no server queues, instant results.",
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
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">How It Works</span>
            <h2 className="font-heading text-4xl md:text-5xl font-black mt-2 mb-4">
              From Track to{" "}
              <span className="gradient-text">Viral Video</span>
              <br />
              in 6 Simple Steps
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              The most streamlined lyrics video creation workflow ever built.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="glass rounded-2xl p-6 border border-border/40 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 font-mono text-4xl font-black text-muted/30 select-none">
                    {step.step}
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6`} />
                  </div>
                  <h3 className="font-heading text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-secondary text-sm font-semibold uppercase tracking-widest">Features</span>
            <h2 className="font-heading text-4xl md:text-5xl font-black mt-2 mb-4">
              Everything You Need to{" "}
              <span className="gradient-text-accent">Go Viral</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="glass rounded-2xl p-6 border border-border/40 hover:border-secondary/30 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                  {feat.icon}
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">{feat.title}</h3>
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
