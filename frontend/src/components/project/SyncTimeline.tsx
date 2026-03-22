import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Zap,
  Hand,
  Clock,
  ChevronRight,
  RotateCcw,
  Info,
  Undo2,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

// ═══════════════════════════════════════════════════════
// Phase 1: Silence Detection (analyzeAudioSilences)
// ═══════════════════════════════════════════════════════
interface SilenceRegion {
  start: number;   // seconds
  end: number;      // seconds
  duration: number; // seconds
  depth: number;    // 0–1, how silent (1 = total silence)
  score: number;    // duration × (1 + depth × 2)
  midpoint: number; // center of the silence region
}

const analyzeAudioSilences = (
  channelData: Float32Array,
  sampleRate: number,
  duration: number
): SilenceRegion[] => {
  // 10ms RMS windows
  const windowMs = 10;
  const windowSize = Math.floor(sampleRate * windowMs / 1000);
  const numWindows = Math.floor(channelData.length / windowSize);
  const energies: number[] = [];

  for (let i = 0; i < numWindows; i++) {
    let sum = 0;
    const offset = i * windowSize;
    for (let j = 0; j < windowSize; j++) {
      const s = channelData[offset + j];
      sum += s * s;
    }
    energies.push(Math.sqrt(sum / windowSize));
  }

  // Adaptive threshold from median energy
  const sorted = [...energies].sort((a, b) => a - b);
  const medianEnergy = sorted[Math.floor(sorted.length / 2)];
  // Noise floor = 5th percentile
  const noiseFloor = sorted[Math.floor(sorted.length * 0.05)];
  const silenceThreshold = Math.max(
    medianEnergy * 0.12,
    noiseFloor * 2,
    0.005
  );

  // Group consecutive sub-threshold windows into silence regions
  const minSilenceWindows = 6; // 60ms minimum
  const silences: SilenceRegion[] = [];
  let regionStart = -1;
  let regionEnergySum = 0;
  let regionCount = 0;

  for (let i = 0; i < energies.length; i++) {
    if (energies[i] < silenceThreshold) {
      if (regionStart < 0) {
        regionStart = i;
        regionEnergySum = 0;
        regionCount = 0;
      }
      regionEnergySum += energies[i];
      regionCount++;
    } else {
      if (regionStart >= 0 && regionCount >= minSilenceWindows) {
        const startSec = (regionStart * windowSize) / sampleRate;
        const endSec = (i * windowSize) / sampleRate;
        const dur = endSec - startSec;
        const avgEnergy = regionEnergySum / regionCount;
        // depth: 0 = just under threshold, 1 = total silence
        const depth = Math.max(0, Math.min(1, 1 - avgEnergy / silenceThreshold));
        const score = dur * (1 + depth * 2);

        silences.push({
          start: startSec,
          end: endSec,
          duration: dur,
          depth,
          score,
          midpoint: (startSec + endSec) / 2,
        });
      }
      regionStart = -1;
    }
  }

  // Handle trailing silence region
  if (regionStart >= 0 && regionCount >= minSilenceWindows) {
    const startSec = (regionStart * windowSize) / sampleRate;
    const endSec = Math.min(duration, (energies.length * windowSize) / sampleRate);
    const dur = endSec - startSec;
    const avgEnergy = regionEnergySum / regionCount;
    const depth = Math.max(0, Math.min(1, 1 - avgEnergy / silenceThreshold));
    silences.push({
      start: startSec,
      end: endSec,
      duration: dur,
      depth,
      score: dur * (1 + depth * 2),
      midpoint: (startSec + endSec) / 2,
    });
  }

  return silences;
};

// ═══════════════════════════════════════════════════════
// Phase 1b: Detect vocal region (skip instrumental intro/outro)
// ═══════════════════════════════════════════════════════
const detectVocalRegion = (
  channelData: Float32Array,
  sampleRate: number,
  silences: SilenceRegion[],
  duration: number
): { vocalsStart: number; vocalsEnd: number } => {
  // Compute energy in 100ms windows for coarse analysis
  const winMs = 100;
  const winSize = Math.floor(sampleRate * winMs / 1000);
  const numWin = Math.floor(channelData.length / winSize);
  const energies: number[] = [];

  for (let i = 0; i < numWin; i++) {
    let sum = 0;
    const off = i * winSize;
    for (let j = 0; j < winSize; j++) {
      const s = channelData[off + j];
      sum += s * s;
    }
    energies.push(Math.sqrt(sum / winSize));
  }

  const maxE = Math.max(...energies, 0.001);
  const audibleThreshold = maxE * 0.05;

  // Find where audio first becomes audible (skip leading silence)
  let audioStartWin = 0;
  for (let i = 0; i < energies.length; i++) {
    if (energies[i] > audibleThreshold) {
      audioStartWin = i;
      break;
    }
  }
  const audioStartSec = (audioStartWin * winSize) / sampleRate;

  // ─── Strategy: find the first significant silence gap AFTER audio starts ───
  // This gap typically separates the instrumental intro from the vocals.
  // "Significant" = at least 150ms, occurring after at least 1 second of audio.
  const minGapForIntro = 0.15; // 150ms silence gap
  const minAudioBeforeGap = 1.0; // at least 1s of audio before we consider a gap as intro→vocal boundary

  let vocalsStart = audioStartSec; // default: start at first audible moment
  let foundIntroGap = false;

  // Look for intro→vocal boundary in the first 50% of the song
  const searchLimit = duration * 0.5;
  for (const s of silences) {
    // Skip silences before audio starts or at the very beginning
    if (s.end <= audioStartSec + minAudioBeforeGap) continue;
    // Only search in first half
    if (s.start > searchLimit) break;
    // Must be a meaningful gap (not just a tiny breath between words in the intro)
    if (s.duration >= minGapForIntro) {
      vocalsStart = s.end; // vocals start right after this silence
      foundIntroGap = true;
      break;
    }
  }

  // If we found an intro gap very late (>40% in), it's probably not a real intro.
  // Limit intro to at most 35% of the song.
  if (foundIntroGap && vocalsStart > duration * 0.35) {
    vocalsStart = audioStartSec;
  }

  // ─── Find vocal end: last significant silence before song end ───
  let vocalsEnd = duration;
  // Look backwards for a significant silence in the last 20% of the song
  const outroSearchStart = duration * 0.8;
  for (let i = silences.length - 1; i >= 0; i--) {
    const s = silences[i];
    if (s.start < outroSearchStart) break;
    if (s.duration >= 0.5) { // 500ms silence near the end = likely outro
      vocalsEnd = s.start;
      break;
    }
  }

  // Ensure vocal region is reasonable (at least 30% of song)
  if (vocalsEnd - vocalsStart < duration * 0.3) {
    vocalsStart = audioStartSec;
    vocalsEnd = duration;
  }

  return { vocalsStart, vocalsEnd };
};

// ═══════════════════════════════════════════════════════
// Phase 2: Optimal Boundary Placement (findOptimalBoundaries)
// ═══════════════════════════════════════════════════════
const findOptimalBoundaries = (
  lyrics: string[],
  silences: SilenceRegion[],
  vocalsStart: number,
  vocalsEnd: number
): { boundaries: number[]; snappedCount: number } => {
  const n = lyrics.length;
  const vocalDuration = vocalsEnd - vocalsStart;
  if (n <= 1) return { boundaries: [vocalsEnd], snappedCount: 0 };

  // Word counts per line
  const wordCounts = lyrics.map((l) => Math.max(1, l.split(/\s+/).filter(Boolean).length));
  const totalWords = wordCounts.reduce((s, w) => s + w, 0);

  // Ideal boundary positions (proportional to word count within vocal region)
  const idealPositions: number[] = [];
  let cumWords = 0;
  for (let i = 0; i < n - 1; i++) {
    cumWords += wordCounts[i];
    idealPositions.push(vocalsStart + (cumWords / totalWords) * vocalDuration);
  }

  // Search window: ±40% of average segment duration
  const avgSegDuration = vocalDuration / n;
  const searchWindow = avgSegDuration * 0.4;

  // Max silence score for normalization
  const maxSilenceScore = silences.length > 0
    ? Math.max(...silences.map((s) => s.score))
    : 1;

  // Greedy ordered matching
  const boundaries: number[] = [];
  let snappedCount = 0;
  let lastBoundary = vocalsStart;

  for (let i = 0; i < idealPositions.length; i++) {
    const ideal = idealPositions[i];
    const windowStart = Math.max(lastBoundary + 0.05, ideal - searchWindow);
    const windowEnd = Math.min(vocalsEnd - 0.05, ideal + searchWindow);

    // Find candidate silences in the window
    const candidates = silences.filter(
      (s) => s.midpoint >= windowStart && s.midpoint <= windowEnd && s.midpoint > lastBoundary
    );

    if (candidates.length > 0) {
      // Pick best candidate: cost = distanceCost × 0.6 + scoreCost × 0.4
      let bestCandidate = candidates[0];
      let bestCost = Infinity;

      for (const c of candidates) {
        const distanceCost = Math.abs(c.midpoint - ideal) / searchWindow; // 0–1
        const scoreCost = 1 - c.score / maxSilenceScore; // 0–1 (lower = better silence)
        const cost = distanceCost * 0.6 + scoreCost * 0.4;

        if (cost < bestCost) {
          bestCost = cost;
          bestCandidate = c;
        }
      }

      boundaries.push(bestCandidate.midpoint);
      lastBoundary = bestCandidate.midpoint;
      snappedCount++;
    } else {
      // Fallback: use ideal position (but enforce monotonicity)
      const fallback = Math.max(lastBoundary + 0.1, ideal);
      boundaries.push(fallback);
      lastBoundary = fallback;
    }
  }

  // Final boundary = vocalsEnd
  boundaries.push(vocalsEnd);

  return { boundaries, snappedCount };
};

// ═══════════════════════════════════════════════════════
// Phase 3: Segment Construction (autoDistributeTimes)
// ═══════════════════════════════════════════════════════
const autoDistributeTimes = async (
  lyrics: string[],
  audioUrl: string,
  fallbackDuration: number
): Promise<{ timings: LyricTiming[]; report: string }> => {
  if (!lyrics.length) return { timings: [], report: "" };

  const n = lyrics.length;

  try {
    // Fetch + decode audio
    const audioCtx = new AudioContext();
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const duration = audioBuffer.duration;
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    audioCtx.close();

    // Phase 1: Detect silences
    const silences = analyzeAudioSilences(channelData, sampleRate, duration);

    // Phase 1b: Detect where vocals actually start/end (skip intro/outro)
    const { vocalsStart, vocalsEnd } = detectVocalRegion(channelData, sampleRate, silences, duration);

    // Phase 2: Find optimal boundaries snapped to silences within vocal region
    const { boundaries, snappedCount } = findOptimalBoundaries(lyrics, silences, vocalsStart, vocalsEnd);

    // Phase 3: Build segments starting at vocalsStart
    const timings: LyricTiming[] = [];
    let segStart = vocalsStart;

    for (let i = 0; i < n; i++) {
      const segEnd = boundaries[i];
      timings.push({
        text: lyrics[i],
        startTime: parseFloat(segStart.toFixed(2)),
        endTime: parseFloat(segEnd.toFixed(2)),
        orderIndex: i,
      });
      segStart = segEnd;
    }

    // Safety: last segment ends at vocalsEnd (not beyond total duration)
    if (timings.length > 0) {
      timings[timings.length - 1].endTime = parseFloat(Math.min(vocalsEnd, duration).toFixed(2));
    }

    const introSec = vocalsStart.toFixed(1);
    const report = `Intro détecté: ${introSec}s · Paroles: ${introSec}s–${vocalsEnd.toFixed(1)}s · ${snappedCount}/${n - 1} frontières sur pauses (${silences.length} silences)`;
    console.log("Auto-sync vocal region:", { vocalsStart, vocalsEnd, silencesFound: silences.length });
    return { timings, report };
  } catch (err) {
    // Fallback: proportional word-based distribution without silence detection
    console.error("Audio analysis failed, using word-proportional fallback:", err);
    const duration = fallbackDuration || 180;
    const wordCounts = lyrics.map((l) => Math.max(1, l.split(/\s+/).filter(Boolean).length));
    const totalWords = wordCounts.reduce((s, w) => s + w, 0);

    const timings: LyricTiming[] = [];
    let cursor = 0;

    for (let i = 0; i < n; i++) {
      const segDur = (wordCounts[i] / totalWords) * duration;
      timings.push({
        text: lyrics[i],
        startTime: parseFloat(cursor.toFixed(2)),
        endTime: parseFloat(Math.min(cursor + segDur, duration).toFixed(2)),
        orderIndex: i,
      });
      cursor += segDur;
    }

    if (timings.length > 0) {
      timings[timings.length - 1].endTime = parseFloat(duration.toFixed(2));
    }

    return { timings, report: "Fallback: distribution proportionnelle (analyse audio échouée)" };
  }
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const markedTimesRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // High-precision time updates via requestAnimationFrame
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

  // Generate waveform visualization from audio
  useEffect(() => {
    if (!audioUrl || waveformBars.length > 0) return;
    const generateWaveform = async () => {
      try {
        const audioCtx = new AudioContext();
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        const data = audioBuffer.getChannelData(0);
        const bars = 120;
        const blockSize = Math.floor(data.length / bars);
        const result: number[] = [];
        for (let i = 0; i < bars; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(data[i * blockSize + j]);
          }
          result.push(sum / blockSize);
        }
        const max = Math.max(...result, 0.001);
        setWaveformBars(result.map((v) => (v / max) * 100));
        audioCtx.close();
      } catch {
        setWaveformBars(Array.from({ length: 120 }, () => Math.random() * 80 + 20));
      }
    };
    generateWaveform();
  }, [audioUrl]);

  // Keyboard handler for manual sync (Space = mark, Backspace = undo)
  useEffect(() => {
    if (syncMethod !== "manual") return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && isPlaying && markingIndex < lyrics.length) {
        e.preventDefault();
        handleMark();
      }
      if ((e.code === "Backspace" || e.key === "z" && (e.metaKey || e.ctrlKey)) && markingIndex > 0) {
        e.preventDefault();
        handleUndoMark();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [syncMethod, isPlaying, markingIndex, lyrics.length, timings]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  // ─── Auto-sync with 3-phase silence-snapping algorithm ─
  const handleAutoSync = async () => {
    if (!audioUrl) return;
    setIsAnalyzing(true);
    try {
      const { timings: result, report } = await autoDistributeTimes(
        lyrics,
        audioUrl,
        audioDuration || 180
      );
      console.log("Auto-sync report:", report);
      onTimingsChange(result);
    } catch (err) {
      console.error("Auto-sync failed:", err);
    }
    setIsAnalyzing(false);
  };

  // ─── Manual mark ────────────────────────────────────
  const handleMark = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || markingIndex >= lyrics.length) return;

    const t = audio.currentTime;
    markedTimesRef.current[markingIndex] = t;
    const newTimings = [...timings];

    // Close previous line exactly at current mark time (seamless boundary)
    if (markingIndex > 0 && newTimings[markingIndex - 1]) {
      newTimings[markingIndex - 1] = {
        ...newTimings[markingIndex - 1],
        endTime: parseFloat(t.toFixed(2)),
      };
    }

    const isLast = markingIndex === lyrics.length - 1;

    newTimings[markingIndex] = {
      text: lyrics[markingIndex],
      startTime: parseFloat(t.toFixed(2)),
      // Last line: ends at audio duration. Others: temporary end, will be closed by next mark.
      endTime: parseFloat((isLast ? audioDuration : t + 10).toFixed(2)),
      orderIndex: markingIndex,
    };

    onTimingsChange(newTimings);
    setMarkingIndex((prev) => Math.min(prev + 1, lyrics.length));
  }, [markingIndex, lyrics, timings, audioDuration, onTimingsChange]);

  // ─── Undo last mark ─────────────────────────────────
  const handleUndoMark = useCallback(() => {
    if (markingIndex <= 0) return;
    const newIdx = markingIndex - 1;
    const newTimings = timings.slice(0, newIdx);
    markedTimesRef.current = markedTimesRef.current.slice(0, newIdx);
    onTimingsChange(newTimings);
    setMarkingIndex(newIdx);

    // Seek audio back to the undone line's approximate position
    if (newIdx > 0 && markedTimesRef.current[newIdx - 1] !== undefined) {
      const seekTo = markedTimesRef.current[newIdx - 1];
      if (audioRef.current) audioRef.current.currentTime = seekTo;
    }
  }, [markingIndex, timings, onTimingsChange]);

  const resetManual = () => {
    setMarkingIndex(0);
    markedTimesRef.current = [];
    onTimingsChange([]);
  };

  // ─── Fine-tune individual timing ────────────────────
  const adjustTiming = (index: number, field: "startTime" | "endTime", delta: number) => {
    const newTimings = [...timings];
    const t = newTimings[index];
    const newVal = parseFloat(Math.max(0, Math.min(audioDuration, t[field] + delta)).toFixed(2));

    if (field === "startTime" && newVal >= t.endTime) return;
    if (field === "endTime" && newVal <= t.startTime) return;

    newTimings[index] = { ...t, [field]: newVal };
    onTimingsChange(newTimings);
  };

  const activeLyric = timings.find(
    (t) => currentTime >= t.startTime && currentTime <= t.endTime
  );
  const progressPct = audioDuration ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div className="space-y-6" ref={containerRef}>
      <div>
        <h2 className="font-heading text-xl font-bold mb-1">Synchroniser les Paroles</h2>
        <p className="text-sm text-muted-foreground">
          Alignez chaque ligne de paroles avec le bon moment dans la musique.
        </p>
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
          Manuel
        </button>
      </div>

      {/* Audio player */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="glass rounded-2xl p-5 border border-border/40">
        {/* Real waveform visualization */}
        <div
          className="relative h-14 bg-muted/30 rounded-lg mb-3 overflow-hidden cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const t = pct * (audioDuration || 180);
            if (audioRef.current) audioRef.current.currentTime = t;
            setCurrentTime(t);
          }}
        >
          {/* Waveform bars */}
          <div className="absolute inset-0 flex items-center gap-px px-1">
            {(waveformBars.length > 0
              ? waveformBars
              : Array.from({ length: 120 }, () => Math.random() * 80 + 20)
            ).map((h, i) => {
              const barPct = (i / (waveformBars.length || 120)) * 100;
              const isPast = barPct < progressPct;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-colors duration-150 ${isPast ? "bg-primary" : "bg-muted-foreground/25"}`}
                  style={{ height: `${Math.max(8, h)}%` }}
                />
              );
            })}
          </div>
          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
            style={{ left: `${progressPct}%` }}
          />
          {/* Timing markers */}
          {timings.map((t, i) => (
            <div
              key={i}
              className="absolute top-0 w-px h-2 bg-secondary/60"
              style={{ left: `${(t.startTime / (audioDuration || 180)) * 100}%` }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center glow-primary hover:opacity-90 transition-opacity"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-primary-foreground" />
            ) : (
              <Play className="w-4 h-4 text-primary-foreground fill-current ml-0.5" />
            )}
          </button>
          <div className="font-mono text-sm text-muted-foreground flex-1">
            <span className="text-foreground">{formatTime(currentTime)}</span>
            <span className="mx-1">/</span>
            {formatTime(audioDuration || 0)}
          </div>
          {/* Active lyric badge */}
          <AnimatePresence mode="wait">
            {activeLyric && (
              <motion.div
                key={activeLyric.orderIndex}
                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                className="glass px-3 py-1.5 rounded-lg border border-primary/30 text-sm text-primary font-medium max-w-[220px] truncate"
              >
                {activeLyric.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Auto Sync Panel */}
      {syncMethod === "auto" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass rounded-xl p-4 border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Synchronisation intelligente</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Analyse l'audio pour détecter les moments vocaux et aligner automatiquement chaque ligne de paroles
              au bon moment. Les paroles s'afficheront légèrement en avance pour une lecture naturelle.
            </p>
            <Button
              onClick={handleAutoSync}
              disabled={isAnalyzing || !audioUrl}
              className="w-full bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 font-semibold gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyse de l'audio...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Auto-Sync {lyrics.length} lignes
                </>
              )}
            </Button>
          </div>
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
              <span className="text-sm font-semibold">Mode Écoute & Marquage</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Lancez l'audio et appuyez sur{" "}
              <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs border border-border/40">
                Espace
              </kbd>{" "}
              ou cliquez "Marquer" au moment exact où chaque ligne est chantée.{" "}
              <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs border border-border/40">
                ⌫
              </kbd>{" "}
              pour annuler.
            </p>

            {/* Current line to mark */}
            <AnimatePresence mode="wait">
              {markingIndex < lyrics.length ? (
                <motion.div
                  key={markingIndex}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="glass rounded-lg p-3 border border-secondary/30 mb-4"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    Prochaine ligne ({markingIndex + 1}/{lyrics.length}) :
                  </p>
                  <p className="font-semibold text-secondary text-base">{lyrics[markingIndex]}</p>
                  {markingIndex + 1 < lyrics.length && (
                    <p className="text-xs text-muted-foreground/50 mt-1 truncate">
                      Ensuite : {lyrics[markingIndex + 1]}
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-lg p-3 border border-green-400/30 mb-4"
                >
                  <p className="text-sm text-green-400 font-semibold">
                    Toutes les lignes sont marquées !
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2">
              <Button
                onClick={handleMark}
                disabled={!isPlaying || markingIndex >= lyrics.length}
                className="flex-1 bg-secondary text-secondary-foreground hover:opacity-90 font-semibold gap-2"
              >
                <ChevronRight className="w-4 h-4" />
                Marquer ({markingIndex}/{lyrics.length})
              </Button>
              <Button
                variant="outline"
                onClick={handleUndoMark}
                disabled={markingIndex === 0}
                className="gap-2 border-border/60"
                title="Annuler le dernier marquage (⌫)"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={resetManual}
                className="gap-2 border-border/60"
                title="Recommencer"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Timings Preview with fine-tuning */}
      {timings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl border border-border/40 overflow-hidden"
        >
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Timeline ({timings.length} lignes)
            </p>
            <p className="text-xs text-muted-foreground">
              Cliquez sur une ligne pour ajuster
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {timings.map((t, i) => {
              const isActive =
                currentTime >= t.startTime && currentTime <= t.endTime;
              const isEditing = editingIdx === i;
              return (
                <div key={i}>
                  <div
                    className={`flex items-center gap-3 px-4 py-2.5 border-b border-border/20 last:border-0 transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary/10"
                        : isEditing
                        ? "bg-muted/30"
                        : "hover:bg-muted/20"
                    }`}
                    onClick={() => {
                      if (audioRef.current)
                        audioRef.current.currentTime = t.startTime;
                      setCurrentTime(t.startTime);
                      setEditingIdx(isEditing ? null : i);
                    }}
                  >
                    <span className="font-mono text-xs text-primary/70 w-12 shrink-0">
                      {formatTime(t.startTime)}
                    </span>
                    <span
                      className={`text-sm flex-1 truncate ${
                        isActive
                          ? "text-primary font-semibold"
                          : "text-foreground/70"
                      }`}
                    >
                      {t.text}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatTime(t.endTime)}
                    </span>
                  </div>
                  {/* Fine-tune controls */}
                  {isEditing && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 py-2 bg-muted/20 border-b border-border/20 flex items-center gap-4 text-xs"
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground w-10">Début</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); adjustTiming(i, "startTime", -0.1); }}
                          className="p-1 rounded hover:bg-muted"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono w-12 text-center">
                          {formatTime(t.startTime)}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); adjustTiming(i, "startTime", 0.1); }}
                          className="p-1 rounded hover:bg-muted"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground w-10">Fin</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); adjustTiming(i, "endTime", -0.1); }}
                          className="p-1 rounded hover:bg-muted"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono w-12 text-center">
                          {formatTime(t.endTime)}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); adjustTiming(i, "endTime", 0.1); }}
                          className="p-1 rounded hover:bg-muted"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
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
