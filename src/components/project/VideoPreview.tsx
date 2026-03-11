import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Maximize2 } from "lucide-react";

interface LyricTiming {
  text: string;
  startTime: number;
  endTime: number;
  orderIndex: number;
}

interface VideoStyle {
  format: string;
  template: string;
  fontStyle: string;
  textPosition: "top" | "center" | "bottom";
  transition: "fade" | "slide" | "bounce";
  showProgress: boolean;
  karaoke: boolean;
}

interface VideoPreviewProps {
  timings: LyricTiming[];
  audioUrl: string;
  coverUrl: string;
  audioDuration: number;
  title: string;
  artist: string;
  style: VideoStyle;
}

const templateBg: Record<string, string> = {
  minimal: "bg-background",
  neon: "bg-gradient-to-br from-background via-primary/10 to-secondary/10",
  cinematic: "bg-gradient-to-b from-background to-black",
  hiphop: "bg-gradient-to-br from-background via-accent/5 to-background",
  lofi: "bg-muted/80",
  karaoke: "bg-gradient-to-br from-background via-secondary/10 to-primary/10",
};

const positionClass: Record<string, string> = {
  top: "justify-start pt-16",
  center: "justify-center",
  bottom: "justify-end pb-16",
};

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  bounce: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
  },
};

const fontClass: Record<string, string> = {
  montserrat: "font-heading font-black",
  inter: "font-body font-bold",
  mono: "font-mono font-bold",
};

const VideoPreview = ({ timings, audioUrl, coverUrl, audioDuration, title, artist, style }: VideoPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnd = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play(); setIsPlaying(true); }
  };

  const reset = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const activeLyric = timings.find(
    (t) => currentTime >= t.startTime && currentTime <= t.endTime
  );
  const progressPct = audioDuration ? (currentTime / audioDuration) * 100 : 0;

  // Aspect ratio by format
  const aspectMap: Record<string, string> = {
    tiktok: "aspect-[9/16]",
    shorts: "aspect-[9/16]",
    youtube: "aspect-video",
    instagram: "aspect-square",
  };
  const aspect = aspectMap[style.format] || "aspect-[9/16]";

  const variants = transitionVariants[style.transition] || transitionVariants.fade;
  const font = fontClass[style.fontStyle] || fontClass.montserrat;
  const bg = templateBg[style.template] || templateBg.minimal;
  const pos = positionClass[style.textPosition] || positionClass.center;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold mb-1">Preview Your Video</h2>
        <p className="text-sm text-muted-foreground">Real-time preview of your lyrics video.</p>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Preview frame */}
      <div className="flex items-start gap-6 flex-col lg:flex-row">
        <div className="flex-1 max-w-xs mx-auto lg:mx-0">
          <div className={`${aspect} relative rounded-2xl overflow-hidden border border-border/40 ${bg}`}>
            {/* Cover blur background */}
            {coverUrl && (
              <>
                <img
                  src={coverUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm scale-110"
                />
                <div className="absolute inset-0 bg-background/60" />
              </>
            )}

            {/* Cover image (center for non-karaoke) */}
            {coverUrl && style.textPosition !== "center" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-2/3 aspect-square object-cover rounded-xl shadow-2xl"
                />
              </div>
            )}

            {/* Lyrics display */}
            <div className={`absolute inset-0 flex flex-col items-center px-6 ${pos}`}>
              <AnimatePresence mode="wait">
                {activeLyric ? (
                  <motion.div
                    key={activeLyric.text}
                    initial={variants.initial}
                    animate={variants.animate}
                    exit={variants.exit}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <p
                      className={`${font} text-xl leading-tight text-glow-primary`}
                      style={{ color: "hsl(var(--foreground))", textShadow: "0 0 20px hsl(var(--primary) / 0.8), 0 2px 8px rgba(0,0,0,0.8)" }}
                    >
                      {activeLyric.text}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center opacity-40"
                  >
                    <p className={`${font} text-sm`} style={{ color: "hsl(var(--muted-foreground))" }}>
                      {title || "Song Title"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            {style.showProgress && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/50">
                <div
                  className="h-full bg-gradient-primary transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            )}

            {/* Artist badge */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <div className="glass px-3 py-1.5 rounded-full border border-border/30">
                <p className="text-xs font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                  {artist || "Artist Name"}
                </p>
              </div>
              <div className="glass w-8 h-8 rounded-full border border-border/30 flex items-center justify-center">
                <div className="w-4 h-4 flex gap-0.5 items-end">
                  {[3, 5, 4, 6, 3].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary rounded-sm wave-bar"
                      style={{ height: `${h * 3}px`, animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Play overlay */}
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center glow-primary hover:scale-105 transition-transform"
                >
                  <Play className="w-6 h-6 fill-current" style={{ color: "hsl(var(--primary-foreground))" }} />
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Controls & timeline */}
        <div className="flex-1 space-y-4">
          {/* Playback controls */}
          <div className="glass rounded-xl p-4 border border-border/40">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={reset} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center glow-primary hover:opacity-90"
              >
                {isPlaying ? <Pause className="w-4 h-4" style={{ color: "hsl(var(--primary-foreground))" }} /> : <Play className="w-4 h-4 fill-current ml-0.5" style={{ color: "hsl(var(--primary-foreground))" }} />}
              </button>
              <div className="font-mono text-sm flex-1 text-muted-foreground">
                <span className="text-foreground">{Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, "0")}</span>
                {" / "}
                {Math.floor(audioDuration / 60)}:{Math.floor(audioDuration % 60).toString().padStart(2, "0")}
              </div>
            </div>

            {/* Progress */}
            <div
              className="relative h-2 bg-muted/50 rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                const t = pct * (audioDuration || 180);
                if (audioRef.current) audioRef.current.currentTime = t;
                setCurrentTime(t);
              }}
            >
              <div className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Active lyric highlight */}
          <div className="glass rounded-xl p-4 border border-border/40 min-h-[80px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeLyric ? (
                <motion.p
                  key={activeLyric.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-heading font-black text-2xl gradient-text text-center"
                >
                  {activeLyric.text}
                </motion.p>
              ) : (
                <p className="text-muted-foreground text-sm">▶ Play to see lyrics preview</p>
              )}
            </AnimatePresence>
          </div>

          {/* Upcoming lyrics */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Upcoming</p>
            {timings
              .filter((t) => t.startTime > currentTime)
              .slice(0, 4)
              .map((t) => (
                <div key={t.orderIndex} className="text-sm text-muted-foreground/60 py-0.5 truncate">
                  {t.text}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
