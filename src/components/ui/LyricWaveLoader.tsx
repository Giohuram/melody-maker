import { motion } from "framer-motion";
import logoImg from "@/assets/lyricwave-logo.png";

interface LyricWaveLoaderProps {
  fullscreen?: boolean;
  message?: string;
}

const bars = [0.3, 0.6, 1, 0.8, 0.5, 0.9, 0.4, 0.7, 1, 0.6, 0.3, 0.8];

const LyricWaveLoader = ({ fullscreen = true, message = "Chargement..." }: LyricWaveLoaderProps) => {
  const containerClass = fullscreen
    ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={containerClass}>
      {/* Ambient glow */}
      {fullscreen && (
        <>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-secondary/8 rounded-full blur-[100px] pointer-events-none" />
        </>
      )}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-8"
      >
        <motion.img
          src={logoImg}
          alt="LyricWave"
          className="w-10 h-10 object-contain"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="font-heading font-black text-2xl gradient-text">LyricWave</span>
      </motion.div>

      {/* Waveform animation */}
      <div className="flex items-end gap-1 h-14 mb-6">
        {bars.map((height, i) => (
          <motion.div
            key={i}
            className="w-2 rounded-full"
            style={{
              background: i % 3 === 0
                ? "hsl(var(--primary))"
                : i % 3 === 1
                ? "hsl(var(--secondary))"
                : "hsl(var(--accent))",
              opacity: 0.7 + height * 0.3,
            }}
            animate={{
              height: [`${height * 24}px`, `${height * 56}px`, `${height * 24}px`],
            }}
            transition={{
              duration: 0.8 + i * 0.07,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.06,
            }}
          />
        ))}
      </div>

      {/* Lyrics note animation */}
      <motion.div
        className="flex items-center gap-2 mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {["♪", "♫", "♩", "♬"].map((note, i) => (
          <motion.span
            key={i}
            className="text-lg"
            style={{ color: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))" }}
            animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          >
            {note}
          </motion.span>
        ))}
      </motion.div>

      {/* Message */}
      <motion.p
        className="text-sm text-muted-foreground font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {message}
      </motion.p>

      {/* Progress bar */}
      <div className="mt-5 w-48 h-1 bg-border/40 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default LyricWaveLoader;
