import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Play, ArrowRight, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const WaveBar = ({ delay }: { delay: number }) => (
  <div
    className="w-1 bg-gradient-primary rounded-full wave-bar"
    style={{
      height: `${Math.random() * 24 + 12}px`,
      animationDelay: `${delay}s`,
    }}
  />
);

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-background/75" />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 border border-primary/30"
        >
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground font-medium">
            ✨ Create professional lyrics videos in minutes
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] mb-6"
        >
          Transform Your{" "}
          <br />
          <span className="gradient-text">Music Into</span>
          <br />
          Viral Videos
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload your track, add lyrics, sync automatically or manually, and export
          stunning lyrics videos for TikTok, YouTube, Instagram & more — in seconds.
        </motion.p>

        {/* Wave animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-end justify-center gap-0.5 h-10 mb-10"
        >
          {Array.from({ length: 40 }, (_, i) => (
            <WaveBar key={i} delay={i * 0.05} />
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/create">
            <Button
              size="lg"
              className="bg-gradient-primary text-primary-foreground border-0 animate-pulse-glow hover:opacity-90 transition-all font-semibold text-base px-8 py-6 gap-2 rounded-xl"
            >
              <Zap className="w-5 h-5" />
              Create Your Video Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="border-border/60 text-foreground hover:bg-muted/50 font-semibold text-base px-8 py-6 gap-2 rounded-xl"
            >
              <Play className="w-5 h-5 fill-current" />
              See How It Works
            </Button>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {[
            { value: "50K+", label: "Videos Created" },
            { value: "12K+", label: "Artists" },
            { value: "4", label: "Export Formats" },
            { value: "Free", label: "To Start" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-3xl font-black gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-muted-foreground/40 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
