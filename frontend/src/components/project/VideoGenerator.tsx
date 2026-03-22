import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Loader2,
  CheckCircle2,
  Film,
  Zap,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface VideoGeneratorProps {
  audioUrl: string;
  coverUrl: string;
  timings: LyricTiming[];
  audioDuration: number;
  title: string;
  artist: string;
  style: VideoStyle;
}

type GenerationState = "idle" | "generating" | "done" | "error";

const formatDimensions: Record<string, [number, number]> = {
  tiktok: [540, 960],
  shorts: [540, 960],
  "youtube-full": [960, 540],
  instagram: [540, 540],
};

const fontMapFn: Record<string, (h: number) => string> = {
  montserrat: (h) => `bold ${Math.round(h * 0.05)}px Montserrat, sans-serif`,
  inter: (h) => `bold ${Math.round(h * 0.05)}px Inter, sans-serif`,
  mono: (h) => `bold ${Math.round(h * 0.042)}px 'JetBrains Mono', monospace`,
};

const textPositionY: Record<string, (h: number, isLandscape: boolean) => number> = {
  top: (h, isLandscape) => isLandscape ? h * 0.3 : h * 0.2,
  center: (h, isLandscape) => isLandscape ? h * 0.55 : h * 0.55,
  bottom: (h, isLandscape) => isLandscape ? h * 0.78 : h * 0.82,
};

// Pick best supported mime type: prefer MP4, fallback to WebM
const getRecorderMime = (): { mimeType: string; extension: string } => {
  const candidates = [
    { mimeType: "video/mp4", extension: "mp4" },
    { mimeType: "video/mp4;codecs=avc1,mp4a.40.2", extension: "mp4" },
    { mimeType: "video/webm;codecs=vp9,opus", extension: "webm" },
    { mimeType: "video/webm;codecs=vp8,opus", extension: "webm" },
    { mimeType: "video/webm", extension: "webm" },
  ];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c.mimeType)) return c;
  }
  return { mimeType: "video/webm", extension: "webm" };
};

const VideoGenerator = ({ audioUrl, coverUrl, timings, audioDuration, title, artist, style }: VideoGeneratorProps) => {
  const [state, setState] = useState<GenerationState>("idle");
  const [progress, setProgress] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [fileExt, setFileExt] = useState("mp4");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cancelRef = useRef(false);

  // ─── Render a single frame at time t ────────────────
  const renderFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
      coverImg: HTMLImageElement | null,
      duration: number
    ) => {
      ctx.clearRect(0, 0, w, h);

      const isAppleMusic = style.transition === "apple-music";
      const textColor = style.textColor || "#FFFFFF";

      // ─── Extract dominant color from cover for Apple Music bg ───
      let dominantR = 26, dominantG = 26, dominantB = 46;
      if (coverImg && isAppleMusic) {
        const tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = 20;
        tmpCanvas.height = 20;
        const tmpCtx = tmpCanvas.getContext("2d")!;
        tmpCtx.drawImage(coverImg, 0, 0, 20, 20);
        const imgData = tmpCtx.getImageData(0, 0, 20, 20).data;
        let rr = 0, gg = 0, bb = 0, cnt = 0;
        for (let p = 0; p < imgData.length; p += 16) {
          rr += imgData[p]; gg += imgData[p+1]; bb += imgData[p+2]; cnt++;
        }
        dominantR = Math.round((rr / cnt) * 0.45);
        dominantG = Math.round((gg / cnt) * 0.45);
        dominantB = Math.round((bb / cnt) * 0.45);
      }

      if (isAppleMusic) {
        // Apple Music background: gradient from cover dominant color
        const bgGrad = ctx.createLinearGradient(0, 0, w * 0.5, h);
        bgGrad.addColorStop(0, `rgb(${dominantR},${dominantG},${dominantB})`);
        bgGrad.addColorStop(1, `rgb(${Math.round(dominantR*0.3)},${Math.round(dominantG*0.3)},${Math.round(dominantB*0.3)})`);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Blurred cover overlay
        if (coverImg) {
          ctx.save();
          ctx.globalAlpha = 0.25;
          ctx.filter = "blur(40px) saturate(1.5)";
          const scale = Math.max(w / coverImg.width, h / coverImg.height) * 1.5;
          const dw = coverImg.width * scale;
          const dh = coverImg.height * scale;
          ctx.drawImage(coverImg, (w - dw) / 2, (h - dh) / 2, dw, dh);
          ctx.restore();
          ctx.globalAlpha = 1;
          ctx.filter = "none";
        }

        // Subtle dark overlay
        const overlay = ctx.createLinearGradient(0, 0, 0, h);
        overlay.addColorStop(0, "rgba(0,0,0,0.2)");
        overlay.addColorStop(1, "rgba(0,0,0,0.45)");
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, w, h);

        // Small cover art top-left
        if (coverImg) {
          const coverSize = Math.round(w * 0.12);
          const cx = Math.round(w * 0.05);
          const cy = Math.round(h * 0.03);
          ctx.save();
          ctx.beginPath();
          const cr = 8;
          ctx.moveTo(cx + cr, cy);
          ctx.lineTo(cx + coverSize - cr, cy);
          ctx.quadraticCurveTo(cx + coverSize, cy, cx + coverSize, cy + cr);
          ctx.lineTo(cx + coverSize, cy + coverSize - cr);
          ctx.quadraticCurveTo(cx + coverSize, cy + coverSize, cx + coverSize - cr, cy + coverSize);
          ctx.lineTo(cx + cr, cy + coverSize);
          ctx.quadraticCurveTo(cx, cy + coverSize, cx, cy + coverSize - cr);
          ctx.lineTo(cx, cy + cr);
          ctx.quadraticCurveTo(cx, cy, cx + cr, cy);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(coverImg, cx, cy, coverSize, coverSize);
          ctx.restore();

          // Title + Artist next to cover
          const textX = cx + coverSize + Math.round(w * 0.03);
          const textY = cy + coverSize * 0.45;
          ctx.textAlign = "left";
          ctx.fillStyle = textColor;
          ctx.font = `bold ${Math.round(h * 0.022)}px Montserrat, sans-serif`;
          ctx.fillText(title || "Song Title", textX, textY, w - textX - w * 0.05);
          ctx.globalAlpha = 0.7;
          ctx.font = `500 ${Math.round(h * 0.018)}px Inter, sans-serif`;
          ctx.fillText(artist || "Artist", textX, textY + h * 0.03, w - textX - w * 0.05);
          ctx.globalAlpha = 1;
        }
      } else {
        // Standard background
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, "#0A0A0F");
        bgGrad.addColorStop(1, "#1A0A2E");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        if (coverImg) {
          ctx.save();
          ctx.globalAlpha = 0.25;
          ctx.filter = "blur(20px)";
          const scale = Math.max(w / coverImg.width, h / coverImg.height) * 1.1;
          const dw = coverImg.width * scale;
          const dh = coverImg.height * scale;
          ctx.drawImage(coverImg, (w - dw) / 2, (h - dh) / 2, dw, dh);
          ctx.restore();
          ctx.globalAlpha = 1;
          ctx.filter = "none";
        }

        const overlay = ctx.createLinearGradient(0, 0, 0, h);
        overlay.addColorStop(0, "rgba(10,10,15,0.6)");
        overlay.addColorStop(0.5, "rgba(10,10,15,0.3)");
        overlay.addColorStop(1, "rgba(10,10,15,0.8)");
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, w, h);

        // Cover art — adapt position for landscape vs portrait vs square
        if (coverImg) {
          const isLand = w > h;
          const isSq = Math.abs(w - h) < 50;
          const size = isLand ? h * 0.4 : isSq ? w * 0.35 : Math.min(w, h) * 0.45;
          const cxc = isLand ? w * 0.25 : w / 2;
          const cyc = isLand ? h * 0.45 : isSq ? h * 0.3 : h * 0.35;
          ctx.save();
          ctx.shadowColor = "#FF006E";
          ctx.shadowBlur = 30;
          ctx.beginPath();
          const r = 20;
          const x = cxc - size / 2;
          const y = cyc - size / 2;
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + size - r, y);
          ctx.quadraticCurveTo(x + size, y, x + size, y + r);
          ctx.lineTo(x + size, y + size - r);
          ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
          ctx.lineTo(x + r, y + size);
          ctx.quadraticCurveTo(x, y + size, x, y + size - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(coverImg, x, y, size, size);
          ctx.restore();

          // Artist + Title — position relative to cover
          const titleX = isLand ? w * 0.6 : w / 2;
          const titleY = isLand ? h * 0.4 : isSq ? h * 0.55 : h * 0.62;
          ctx.textAlign = isLand ? "left" : "center";
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.font = `500 ${Math.round(Math.min(w, h) * 0.028)}px Inter, sans-serif`;
          ctx.fillText(artist || "Artist", titleX, titleY);
          ctx.fillStyle = "rgba(255,255,255,0.95)";
          ctx.font = `bold ${Math.round(Math.min(w, h) * 0.038)}px Montserrat, sans-serif`;
          ctx.fillText(title || "Song Title", titleX, titleY + Math.min(w, h) * 0.04);
        }
      }

      // ─── Lyrics ─────────────────────────────────────
      const activeLyricIdx = timings.findIndex((l) => t >= l.startTime && t <= l.endTime);
      const activeLyric = activeLyricIdx >= 0 ? timings[activeLyricIdx] : null;

      if (isAppleMusic) {
        const lineH = h * 0.06;
        const visibleLines = 9;
        const centerY = h * 0.5;
        const startIdx = Math.max(0, activeLyricIdx - Math.floor(visibleLines / 2));
        ctx.textAlign = "left";
        const leftPad = w * 0.06;
        const maxW = w * 0.88;

        for (let vi = 0; vi < visibleLines && startIdx + vi < timings.length; vi++) {
          const idx = startIdx + vi;
          const line = timings[idx];
          const ly = centerY + (vi - Math.floor(visibleLines / 2)) * lineH;
          const isActive = idx === activeLyricIdx;
          const isPast = activeLyricIdx >= 0 ? idx < activeLyricIdx : line.endTime < t;
          const distFromCenter = Math.abs(vi - Math.floor(visibleLines / 2)) / (visibleLines / 2);
          ctx.globalAlpha = Math.max(0.1, 1 - distFromCenter * 0.85);
          ctx.shadowBlur = 0;

          if (isActive) {
            ctx.font = `900 ${Math.round(lineH * 0.65)}px Montserrat, sans-serif`;
            ctx.fillStyle = textColor;
            ctx.globalAlpha = 1;
            ctx.fillText(line.text, leftPad, ly + lineH * 0.15, maxW);
          } else {
            ctx.font = `700 ${Math.round(lineH * 0.55)}px Montserrat, sans-serif`;
            ctx.fillStyle = textColor;
            ctx.globalAlpha = ctx.globalAlpha * (isPast ? 0.25 : 0.4);
            ctx.fillText(line.text, leftPad, ly + lineH * 0.15, maxW);
          }
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      } else if (activeLyric) {
        const isLandscape = w > h;
        const baseY = (textPositionY[style.textPosition] || textPositionY.center)(h, isLandscape);
        const progress = Math.min(1, (t - activeLyric.startTime) / 0.35);
        const exitProgress = Math.max(0, 1 - (activeLyric.endTime - t) / 0.25);

        // Transition-specific animation offsets
        let offsetY = 0;
        let scale = 1;
        let alpha = progress;

        if (style.transition === "slide") {
          // Slide up from below
          offsetY = (1 - progress) * h * 0.06;
          // Slide out upward at end
          if (exitProgress > 0) {
            offsetY = -exitProgress * h * 0.04;
            alpha = 1 - exitProgress;
          }
        } else if (style.transition === "bounce") {
          // Bounce-in: overshoot then settle
          if (progress < 1) {
            const p = progress;
            scale = p < 0.6 ? p / 0.6 * 1.15 : 1.15 - (p - 0.6) / 0.4 * 0.15;
            alpha = Math.min(1, p / 0.4);
          } else {
            scale = 1;
          }
          // Scale out at end
          if (exitProgress > 0) {
            scale = 1 + exitProgress * 0.12;
            alpha = 1 - exitProgress;
          }
        } else {
          // Fade (default): simple opacity
          if (exitProgress > 0) {
            alpha = 1 - exitProgress;
          }
        }

        const lyricY = baseY + offsetY;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = textColor;
        ctx.font = (fontMapFn[style.fontStyle] || fontMapFn.montserrat)(h);
        ctx.textAlign = "center";

        // Apply scale transform via translate
        if (scale !== 1) {
          ctx.translate(w / 2, lyricY);
          ctx.scale(scale, scale);
          ctx.translate(-w / 2, -lyricY);
        }

        // Word-wrap
        const maxWidth = w * 0.85;
        const words = activeLyric.text.split(" ");
        let line = "";
        const lines: string[] = [];
        for (const word of words) {
          const test = line + word + " ";
          if (ctx.measureText(test).width > maxWidth && line !== "") {
            lines.push(line.trim());
            line = word + " ";
          } else {
            line = test;
          }
        }
        lines.push(line.trim());
        lines.forEach((l, i) => {
          ctx.fillText(l, w / 2, lyricY + i * (h * 0.07));
        });
        ctx.restore();
      }
    },
    [timings, style, title, artist]
  );

  // ─── Generate video with audio in real-time ─────────
  const generate = async () => {
    setState("generating");
    setProgress(0);
    cancelRef.current = false;

    try {
      const [w, h] = formatDimensions[style.format] || [540, 960];
      const canvas = canvasRef.current!;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      // Load cover image
      let coverImg: HTMLImageElement | null = null;
      if (coverUrl) {
        coverImg = await new Promise<HTMLImageElement>((res, rej) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => res(img);
          img.onerror = rej;
          img.src = coverUrl;
        });
      }

      // Decode audio for playback
      const audioCtx = new AudioContext();
      const audioData = await fetch(audioUrl).then((r) => r.arrayBuffer());
      const audioBuffer = await audioCtx.decodeAudioData(audioData);
      const duration = audioBuffer.duration || audioDuration || 30;

      // Create audio source → connect to both speakers and capture destination
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      const audioDest = audioCtx.createMediaStreamDestination();
      source.connect(audioDest);
      // Also connect to speakers so user hears it during generation
      source.connect(audioCtx.destination);

      // Combine canvas video stream + audio stream
      const canvasStream = canvas.captureStream(30);
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioDest.stream.getAudioTracks(),
      ]);

      // Pick best mime type
      const { mimeType, extension } = getRecorderMime();
      setFileExt(extension);

      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 5_000_000,
        audioBitsPerSecond: 128_000,
      });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const recordingDone = new Promise<void>((res) => {
        recorder.onstop = () => res();
      });

      // Start recording + audio playback simultaneously
      recorder.start(200);
      source.start(0);

      // Render frames in real-time synced to audio context clock
      const startWallTime = audioCtx.currentTime;

      await new Promise<void>((resolve) => {
        const tick = () => {
          if (cancelRef.current) {
            resolve();
            return;
          }

          const elapsed = audioCtx.currentTime - startWallTime;
          const t = Math.min(elapsed, duration);

          renderFrame(ctx, w, h, t, coverImg, duration);
          setProgress(Math.round((t / duration) * 100));

          if (elapsed >= duration) {
            resolve();
          } else {
            requestAnimationFrame(tick);
          }
        };
        requestAnimationFrame(tick);
      });

      // Small delay to flush last audio samples
      await new Promise((r) => setTimeout(r, 300));

      // Stop everything
      try { source.stop(); } catch { /* already stopped */ }
      recorder.stop();
      await recordingDone;
      audioCtx.close();

      if (cancelRef.current) {
        setState("idle");
        return;
      }

      const blob = new Blob(chunks, { type: mimeType });
      setVideoBlob(blob);
      setState("done");
    } catch (err) {
      console.error("Video generation error:", err);
      setState("error");
    }
  };

  const download = () => {
    if (!videoBlob) return;
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "lyricwave"}-${style.format}.${fileExt}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h2 className="font-heading text-lg sm:text-xl font-bold mb-1">Générer & Exporter</h2>
        <p className="text-sm text-muted-foreground">Rendu de votre vidéo lyrics avec audio et téléchargement.</p>
      </div>

      {/* Hidden canvas for rendering */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Status card */}
      <div className="glass rounded-2xl p-6 sm:p-8 border border-border/40 text-center">
        {state === "idle" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center animate-float">
              <Film className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold mb-1">Prêt à Générer</h3>
              <p className="text-sm text-muted-foreground">
                {timings.length} lignes · {formatDuration(audioDuration)} · {style.format.toUpperCase()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                La génération se fait en temps réel — durée ≈ {formatDuration(audioDuration)}
              </p>
            </div>
            <Button
              onClick={generate}
              disabled={!audioUrl || timings.length === 0}
              className="bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 font-semibold gap-2 px-6 sm:px-8 py-5 sm:py-6 text-base rounded-xl"
            >
              <Zap className="w-5 h-5" />
              Générer la Vidéo
            </Button>
            {(!audioUrl || timings.length === 0) && (
              <p className="text-xs text-muted-foreground">Ajoutez l'audio et synchronisez les paroles d'abord</p>
            )}
          </div>
        )}

        {state === "generating" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold mb-1">Génération en cours...</h3>
              <p className="text-sm text-muted-foreground">Enregistrement vidéo + audio en temps réel</p>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="font-mono text-sm text-primary">{progress}%</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { cancelRef.current = true; }}
              className="border-border/60 text-xs"
            >
              Annuler
            </Button>
          </div>
        )}

        {state === "done" && videoBlob && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-green-400/10 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold mb-1 text-green-400">Vidéo Prête !</h3>
              <p className="text-sm text-muted-foreground">
                {(videoBlob.size / 1024 / 1024).toFixed(1)} Mo · {fileExt.toUpperCase()} · avec audio
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={download}
                className="bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 font-semibold gap-2 px-6 sm:px-8 py-5 sm:py-6 text-base rounded-xl"
              >
                <Download className="w-5 h-5" />
                Télécharger ({fileExt.toUpperCase()})
              </Button>
              <Button
                variant="outline"
                onClick={() => { setState("idle"); setVideoBlob(null); }}
                className="border-border/60 gap-2 py-5 sm:py-6 rounded-xl"
              >
                Re-générer
              </Button>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold mb-1 text-destructive">Génération Échouée</h3>
              <p className="text-sm text-muted-foreground">Une erreur s'est produite. Veuillez réessayer.</p>
            </div>
            <Button
              onClick={() => setState("idle")}
              variant="outline"
              className="border-border/60 gap-2"
            >
              Réessayer
            </Button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-xl p-3 sm:p-4 border border-border/40">
          <p className="text-xs text-muted-foreground mb-1">Format</p>
          <p className="font-semibold text-sm uppercase">{style.format}</p>
        </div>
        <div className="glass rounded-xl p-3 sm:p-4 border border-border/40">
          <p className="text-xs text-muted-foreground mb-1">Paroles</p>
          <p className="font-semibold text-sm">{timings.length} lignes sync.</p>
        </div>
        <div className="glass rounded-xl p-3 sm:p-4 border border-border/40">
          <p className="text-xs text-muted-foreground mb-1">Durée</p>
          <p className="font-semibold text-sm font-mono">{formatDuration(audioDuration)}</p>
        </div>
        <div className="glass rounded-xl p-3 sm:p-4 border border-border/40">
          <p className="text-xs text-muted-foreground mb-1">Sortie</p>
          <p className="font-semibold text-sm uppercase">{fileExt} + audio</p>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
