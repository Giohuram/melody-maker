import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Zap,
  Hand,
  Clock,
  ChevronRight,
  RotateCcw,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface LyricTiming {
  text: string;
  startTime: number;
  endTime: number;
  orderIndex: number;
}

interface SyncTimelineProps {
  lyrics: string[];
  audioDuration: number;
  audioUrl: string;
  timings: LyricTiming[];
  onTimingsChange: (timings: LyricTiming[]) => void;
  syncMethod: "auto" | "manual";
  onSyncMethodChange: (m: "auto" | "manual") => void;
}

// Auto-sync algorithm
const autoSyncLyrics = (lyrics: string[], duration: number): LyricTiming[] => {
  if (!lyrics.length || !duration) return [];

  const totalWords = lyrics.reduce((sum, l) => sum + l.split(" ").filter(Boolean).length, 0);
  const introPct = 0.05;
  const outroPct = 0.05;
  const usableDuration = duration * (1 - introPct - outroPct);
  const startOffset = duration * introPct;

  return lyrics.map((text, index) => {
    const wordsBeforeLine = lyrics.slice(0, index).reduce((sum, l) => sum + l.split(" ").filter(Boolean).length, 0);
    const lineWords = text.split(" ").filter(Boolean).length;

    const startFrac = wordsBeforeLine / totalWords;
    const endFrac = (wordsBeforeLine + lineWords) / totalWords;

    const startTime = startOffset + startFrac * usableDuration;
    const endTime = Math.min(duration, startOffset + endFrac * usableDuration - 0.1);

    return { text, startTime: parseFloat(startTime.toFixed(2)), endTime: parseFloat(endTime.toFixed(2)), orderIndex: index };
  });
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(1);
  return `${m}:${sec.padStart(4, "0")}`;
};

const SyncTimeline = ({
  lyrics,
  audioDuration,
  audioUrl,
  timings,
  onTimingsChange,
  syncMethod,
  onSyncMethodChange,
}: SyncTimelineProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [markingIndex, setMarkingIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const markedTimesRef = useRef<number[]>([]);

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

  const handleAutoSync = () => {
    const result = autoSyncLyrics(lyrics, audioDuration || 180);
    onTimingsChange(result);
  };

  const handleMark = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || markingIndex >= lyrics.length) return;

    const t = audio.currentTime;
    markedTimesRef.current[markingIndex] = t;
    const newTimings = [...timings];

    if (markingIndex > 0) {
      newTimings[markingIndex - 1] = {
        ...newTimings[markingIndex - 1],
        endTime: t,
      };
    }

    newTimings[markingIndex] = {
      text: lyrics[markingIndex],
      startTime: t,
      endTime: markingIndex === lyrics.length - 1 ? audioDuration : t + 3,
      orderIndex: markingIndex,
    };

    onTimingsChange(newTimings);
    setMarkingIndex((prev) => Math.min(prev + 1, lyrics.length));
  }, [markingIndex, lyrics, timings, audioDuration, onTimingsChange]);

  const resetManual = () => {
    setMarkingIndex(0);
    markedTimesRef.current = [];
    onTimingsChange([]);
  };

  const activeLyric = timings.find(
    (t) => currentTime >= t.startTime && currentTime <= t.endTime
  );

  const progressPct = audioDuration ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold mb-1">Sync Lyrics</h2>
        <p className="text-sm text-muted-foreground">Match your lyrics to the music timeline.</p>
      </div>

      {/* Sync mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => onSyncMethodChange("auto")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
            syncMethod === "auto"
              ? "bg-primary/15 border-primary/50 text-primary"
              : "border-border/40 text-muted-foreground hover:border-border/80"
          }`}
        >
          <Zap className="w-4 h-4" />
          Auto-Sync
        </button>
        <button
          onClick={() => onSyncMethodChange("manual")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
            syncMethod === "manual"
              ? "bg-secondary/15 border-secondary/50 text-secondary"
              : "border-border/40 text-muted-foreground hover:border-border/80"
          }`}
        >
          <Hand className="w-4 h-4" />
          Manual
        </button>
      </div>

      {/* Audio player */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="glass rounded-2xl p-5 border border-border/40">
        {/* Waveform / progress bar */}
        <div className="relative h-12 bg-muted/30 rounded-lg mb-3 overflow-hidden cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const t = pct * (audioDuration || 180);
            if (audioRef.current) audioRef.current.currentTime = t;
            setCurrentTime(t);
          }}
        >
          <div className="absolute inset-0 flex items-center gap-0.5 px-2 opacity-40">
            {Array.from({ length: 80 }, (_, i) => (
              <div key={i} className="flex-1 bg-primary rounded-sm" style={{ height: `${Math.random() * 80 + 20}%` }} />
            ))}
          </div>
          <div
            className="absolute inset-y-0 left-0 bg-primary/30 transition-all"
            style={{ width: `${progressPct}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary transition-all"
            style={{ left: `${progressPct}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center glow-primary hover:opacity-90 transition-opacity"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-primary-foreground" /> : <Play className="w-4 h-4 text-primary-foreground fill-current ml-0.5" />}
          </button>
          <div className="font-mono text-sm text-muted-foreground flex-1">
            <span className="text-foreground">{formatTime(currentTime)}</span>
            <span className="mx-1">/</span>
            {formatTime(audioDuration || 0)}
          </div>
          {/* Active lyric */}
          {activeLyric && (
            <motion.div
              key={activeLyric.text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass px-3 py-1.5 rounded-lg border border-primary/30 text-sm text-primary font-medium max-w-[200px] truncate"
            >
              {activeLyric.text}
            </motion.div>
          )}
        </div>
      </div>

      {/* Auto Sync Panel */}
      {syncMethod === "auto" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Button
            onClick={handleAutoSync}
            className="w-full bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 font-semibold gap-2"
          >
            <Zap className="w-4 h-4" />
            Auto-Sync {lyrics.length} Lines
          </Button>
        </motion.div>
      )}

      {/* Manual Sync Panel */}
      {syncMethod === "manual" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass rounded-xl p-4 border border-border/40">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold">Listen & Mark Mode</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Play the audio. Click "Mark" (or press <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">Space</kbd>) each time the next lyric line begins.
            </p>

            {/* Current line to mark */}
            {markingIndex < lyrics.length ? (
              <div className="glass rounded-lg p-3 border border-secondary/30 mb-4">
                <p className="text-xs text-muted-foreground mb-1">Next line to mark ({markingIndex + 1}/{lyrics.length}):</p>
                <p className="font-semibold text-secondary">{lyrics[markingIndex]}</p>
              </div>
            ) : (
              <div className="glass rounded-lg p-3 border border-green-400/30 mb-4">
                <p className="text-sm text-green-400 font-semibold">✅ All lines marked!</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleMark}
                disabled={!isPlaying || markingIndex >= lyrics.length}
                className="flex-1 bg-secondary text-secondary-foreground hover:opacity-90 font-semibold gap-2"
              >
                <ChevronRight className="w-4 h-4" />
                Mark ({markingIndex}/{lyrics.length})
              </Button>
              <Button
                variant="outline"
                onClick={resetManual}
                className="gap-2 border-border/60"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Timings Preview */}
      {timings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl border border-border/40 overflow-hidden"
        >
          <div className="p-4 border-b border-border/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Sync Timeline ({timings.length} lines)
            </p>
          </div>
          <div className="max-h-52 overflow-y-auto">
            {timings.map((t, i) => {
              const isActive = currentTime >= t.startTime && currentTime <= t.endTime;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-2.5 border-b border-border/20 last:border-0 transition-colors cursor-pointer ${
                    isActive ? "bg-primary/10" : "hover:bg-muted/20"
                  }`}
                  onClick={() => { if (audioRef.current) audioRef.current.currentTime = t.startTime; setCurrentTime(t.startTime); }}
                >
                  <span className="font-mono text-xs text-primary/70 w-12 shrink-0">{formatTime(t.startTime)}</span>
                  <span className={`text-sm flex-1 truncate ${isActive ? "text-primary font-semibold" : "text-foreground/70"}`}>
                    {t.text}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{formatTime(t.endTime)}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SyncTimeline;
