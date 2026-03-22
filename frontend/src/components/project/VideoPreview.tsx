import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

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
  transition: "fade" | "slide" | "bounce" | "apple-music";
  showProgress: boolean;
  karaoke: boolean;
  textColor: string;
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
  "apple-music": {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
};

const fontClass: Record<string, string> = {
  montserrat: "font-heading font-black",
  inter: "font-body font-bold",
  mono: "font-mono font-bold",
};

// ─── Extract dominant color from an image ─────────────
const useDominantColor = (imageUrl: string): string => {
  const [color, setColor] = useState("#1a1a2e");

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 50;
      canvas.height = 50;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 50, 50);
      const data = ctx.getImageData(0, 0, 50, 50).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 16) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      // Darken for background use
      const dr = Math.round(r * 0.4);
      const dg = Math.round(g * 0.4);
      const db = Math.round(b * 0.4);
      setColor(`rgb(${dr},${dg},${db})`);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return color;
};

// ─── Apple Music scrolling lyrics sub-component ──────
const AppleMusicLyrics = ({
  timings,
  currentTime,
  font,
  textColor,
}: {
  timings: LyricTiming[];
  currentTime: number;
  font: string;
  textColor: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const activeIdx = timings.findIndex(
    (t) => currentTime >= t.startTime && currentTime <= t.endTime
  );

  // Smooth scroll active line to center
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const el = activeRef.current;
      const containerH = container.clientHeight;
      const elTop = el.offsetTop;
      const elH = el.clientHeight;
      const targetScroll = elTop - containerH / 2 + elH / 2;
      container.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  }, [activeIdx]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden flex flex-col px-5"
      style={{
        top: "60px",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)",
      }}
    >
      <div className="py-[35%]">
        {timings.map((t, i) => {
          const isActive = i === activeIdx;
          const isPast = activeIdx >= 0 ? i < activeIdx : t.endTime < currentTime;

          return (
            <div
              key={i}
              ref={isActive ? activeRef : undefined}
              className="py-2 transition-all duration-500 ease-out"
              style={{
                transformOrigin: "left center",
              }}
            >
              <p
                className={`${font} leading-snug transition-all duration-500`}
                style={{
                  fontSize: isActive ? "1.25rem" : "1rem",
                  color: textColor,
                  opacity: isActive ? 1 : isPast ? 0.25 : 0.4,
                  fontWeight: isActive ? 900 : 700,
                }}
              >
                {t.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const VideoPreview = ({ timings, audioUrl, coverUrl, audioDuration, title, artist, style }: VideoPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number>(0);

  // High-precision playback via rAF
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnd = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnd);

    const tick = () => {
      if (audio && !audio.paused) {
        setCurrentTime(audio.currentTime);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      audio.removeEventListener("ended", onEnd);
      cancelAnimationFrame(rafRef.current);
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

  const aspectMap: Record<string, string> = {
    tiktok: "aspect-[9/16]",
    shorts: "aspect-[9/16]",
    "youtube-full": "aspect-video",
    instagram: "aspect-square",
  };
  const aspect = aspectMap[style.format] || "aspect-[9/16]";

  const variants = transitionVariants[style.transition] || transitionVariants.fade;
  const font = fontClass[style.fontStyle] || fontClass.montserrat;
  const bg = templateBg[style.template] || templateBg.minimal;
  const pos = positionClass[style.textPosition] || positionClass.center;

  const isAppleMusic = style.transition === "apple-music";
  const dominantColor = useDominantColor(coverUrl);
  const textColor = style.textColor || "#FFFFFF";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold mb-1">Aperçu de la Vidéo</h2>
        <p className="text-sm text-muted-foreground">Prévisualisation en temps réel de votre vidéo lyrics.</p>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Preview frame */}
      <div className="flex items-start gap-6 flex-col lg:flex-row">
        <div className="flex-1 max-w-xs mx-auto lg:mx-0">
          <div
            className={`${aspect} relative rounded-2xl overflow-hidden border border-border/40 ${isAppleMusic ? '' : bg}`}
            style={isAppleMusic ? { background: `linear-gradient(160deg, ${dominantColor}, rgba(0,0,0,0.95))` } : undefined}
          >
            {/* Cover blur background (non apple-music) */}
            {coverUrl && !isAppleMusic && (
              <>
                <img
                  src={coverUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-sm scale-110 opacity-30"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "hsl(var(--background) / 0.6)" }}
                />
              </>
            )}

            {/* Apple Music: blurred cover as warm background */}
            {coverUrl && isAppleMusic && (
              <>
                <img
                  src={coverUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover scale-150"
                  style={{ opacity: 0.3, filter: "blur(40px) saturate(1.8)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))" }}
                />
              </>
            )}

            {/* Cover image (only for non-apple-music center views) */}
            {coverUrl && !isAppleMusic && style.textPosition !== "center" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-2/3 aspect-square object-cover rounded-xl shadow-2xl"
                />
              </div>
            )}

            {/* Apple Music: small cover + title + artist at TOP-LEFT */}
            {isAppleMusic && (
              <div className="absolute top-3 left-3 right-3 flex items-center gap-2.5 z-10">
                {coverUrl && (
                  <img
                    src={coverUrl}
                    alt={title}
                    className="w-10 h-10 rounded-lg shadow-lg object-cover shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate" style={{ color: textColor }}>
                    {title || "Song Title"}
                  </p>
                  <p className="text-xs truncate" style={{ color: textColor, opacity: 0.7 }}>
                    {artist || "Artist"}
                  </p>
                </div>
              </div>
            )}

            {/* Lyrics display */}
            {isAppleMusic ? (
              <AppleMusicLyrics
                timings={timings}
                currentTime={currentTime}
                font={font}
                textColor={textColor}
              />
            ) : (
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
                        className={`${font} text-xl leading-tight`}
                        style={{ color: textColor, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
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
            )}

            {/* Artist badge (non apple-music) */}
            {!isAppleMusic && (
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
            )}

            {/* Play overlay */}
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center z-20"
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
                <p className="text-muted-foreground text-sm">Lancez la lecture pour voir l'aperçu</p>
              )}
            </AnimatePresence>
          </div>

          {/* Scrolling lyrics sidebar (Apple Music style) */}
          {isAppleMusic ? (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">Paroles</p>
              <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
                {timings.map((t, i) => {
                  const isActive = currentTime >= t.startTime && currentTime <= t.endTime;
                  const isPast = t.endTime < currentTime;
                  return (
                    <div
                      key={i}
                      className={`py-1 px-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        isActive
                          ? "bg-primary/10 text-primary font-bold"
                          : isPast
                          ? "text-muted-foreground/30"
                          : "text-muted-foreground/50 hover:text-muted-foreground"
                      }`}
                      style={{ fontSize: isActive ? "0.95rem" : "0.85rem" }}
                      onClick={() => {
                        if (audioRef.current) audioRef.current.currentTime = t.startTime;
                        setCurrentTime(t.startTime);
                      }}
                    >
                      {t.text}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">À venir</p>
              {timings
                .filter((t) => t.startTime > currentTime)
                .slice(0, 4)
                .map((t) => (
                  <div key={t.orderIndex} className="text-sm text-muted-foreground/60 py-0.5 truncate">
                    {t.text}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
