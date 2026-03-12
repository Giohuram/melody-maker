import { useState, useRef } from "react";
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
  transition: "fade" | "slide" | "bounce";
  showProgress: boolean;
  karaoke: boolean;
}

// format → [width, height]


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
  youtube: [540, 960],
  "youtube-full": [960, 540],
  instagram: [540, 540],
};

const fontMap: Record<string, string> = {
  montserrat: "bold 48px Montserrat",
  inter: "bold 48px Inter",
  mono: "bold 42px 'JetBrains Mono'",
};

const textPositionY: Record<string, (h: number) => number> = {
  top: (h) => h * 0.2,
  center: (h) => h * 0.55,
  bottom: (h) => h * 0.82,
};

const VideoGenerator = ({ audioUrl, coverUrl, timings, audioDuration, title, artist, style }: VideoGeneratorProps) => {
  const [state, setState] = useState<GenerationState>("idle");
  const [progress, setProgress] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = async () => {
    setState("generating");
    setProgress(0);

    try {
      const [w, h] = formatDimensions[style.format] || [540, 960];
      const canvas = canvasRef.current!;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      // Load cover image
      let coverImg: HTMLImageElement | null = null;
      if (coverUrl) {
        coverImg = await new Promise<HTMLImageElement>((res) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => res(img);
          img.src = coverUrl;
        });
      }

      // Load audio
      const audioCtx = new AudioContext();
      const audioData = await fetch(audioUrl).then((r) => r.arrayBuffer());
      const audioBuffer = await audioCtx.decodeAudioData(audioData);
      const duration = audioBuffer.duration || audioDuration || 30;

      // Setup MediaRecorder
      const stream = canvas.captureStream(30);
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm",
        videoBitsPerSecond: 5_000_000,
      });
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

      const recordingDone = new Promise<void>((res) => {
        recorder.onstop = () => res();
      });

      recorder.start(100);

      const fps = 30;
      const totalFrames = Math.ceil(Math.min(duration, 60) * fps);
      const frameDurationMs = 1000 / fps;

      const renderFrame = (frame: number) => {
        const t = frame / fps;
        ctx.clearRect(0, 0, w, h);

        // Background
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, "#0A0A0F");
        bgGrad.addColorStop(1, "#1A0A2E");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Cover blur bg
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

        // Overlay
        const overlay = ctx.createLinearGradient(0, 0, 0, h);
        overlay.addColorStop(0, "rgba(10,10,15,0.6)");
        overlay.addColorStop(0.5, "rgba(10,10,15,0.3)");
        overlay.addColorStop(1, "rgba(10,10,15,0.8)");
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, w, h);

        // Cover image
        if (coverImg) {
          const size = Math.min(w, h) * 0.45;
          const cx = w / 2;
          const cy = h * 0.35;
          ctx.save();
          ctx.shadowColor = "#FF006E";
          ctx.shadowBlur = 30;
          ctx.beginPath();
          const r = 20;
          const x = cx - size / 2;
          const y = cy - size / 2;
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
        }

        // Artist + Title
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = `500 ${Math.round(h * 0.025)}px Inter, sans-serif`;
        ctx.fillText(artist || "Artist", w / 2, h * 0.62);

        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = `bold ${Math.round(h * 0.032)}px Montserrat, sans-serif`;
        ctx.fillText(title || "Song Title", w / 2, h * 0.65);

        // Active lyric
        const activeLyric = timings.find((l) => t >= l.startTime && t <= l.endTime);
        if (activeLyric) {
          const lyricY = textPositionY[style.textPosition](h);
          const alpha = Math.min(1, (t - activeLyric.startTime) / 0.3);
          ctx.globalAlpha = alpha;
          ctx.shadowColor = "#FF006E";
          ctx.shadowBlur = 20;
          ctx.fillStyle = "#FFFFFF";
          ctx.font = fontMap[style.fontStyle] || fontMap.montserrat;
          ctx.textAlign = "center";

          // Wrap text
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

          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }

        // Progress bar
        if (style.showProgress) {
          ctx.fillStyle = "rgba(255,255,255,0.1)";
          ctx.fillRect(0, h - 4, w, 4);
          const grad = ctx.createLinearGradient(0, 0, w, 0);
          grad.addColorStop(0, "#FF006E");
          grad.addColorStop(1, "#8338EC");
          ctx.fillStyle = grad;
          ctx.fillRect(0, h - 4, (t / duration) * w, 4);
        }
      };

      // Render all frames
      for (let frame = 0; frame <= totalFrames; frame++) {
        renderFrame(frame);
        setProgress(Math.round((frame / totalFrames) * 100));
        await new Promise((r) => setTimeout(r, frameDurationMs));
      }

      recorder.stop();
      await recordingDone;

      const blob = new Blob(chunks, { type: "video/webm" });
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
    a.download = `${title || "lyricwave"}-${style.format}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h2 className="font-heading text-lg sm:text-xl font-bold mb-1">Générer & Exporter</h2>
        <p className="text-sm text-muted-foreground">Rendu de votre vidéo lyrics et téléchargement.</p>
      </div>

      {/* Hidden canvas for rendering */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Status card */}
      <div className="glass rounded-2xl p-8 border border-border/40 text-center">
        {state === "idle" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center animate-float">
              <Film className="w-8 h-8" style={{ color: "hsl(var(--primary-foreground))" }} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold mb-1">Ready to Render</h3>
              <p className="text-sm text-muted-foreground">
                {timings.length} lyrics lines · {Math.round(audioDuration)}s · {style.format.toUpperCase()}
              </p>
            </div>
            <Button
              onClick={generate}
              disabled={!audioUrl || timings.length === 0}
              className="bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 font-semibold gap-2 px-8 py-6 text-base rounded-xl"
            >
              <Zap className="w-5 h-5" />
              Generate Video
            </Button>
            {(!audioUrl || timings.length === 0) && (
              <p className="text-xs text-muted-foreground">Add audio and sync lyrics first</p>
            )}
          </div>
        )}

        {state === "generating" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(var(--primary-foreground))" }} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold mb-1">Rendering...</h3>
              <p className="text-sm text-muted-foreground">Generating your lyrics video frame by frame</p>
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
          </div>
        )}

        {state === "done" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-green-400/10 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold mb-1 text-green-400">Video Ready!</h3>
              <p className="text-sm text-muted-foreground">Your lyrics video has been generated successfully.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={download}
                className="bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 font-semibold gap-2 px-8 py-6 text-base rounded-xl"
              >
                <Download className="w-5 h-5" />
                Download Video
              </Button>
              <Button
                variant="outline"
                onClick={() => setState("idle")}
                className="border-border/60 gap-2 py-6 rounded-xl"
              >
                Re-generate
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
              <h3 className="font-heading text-lg font-bold mb-1 text-destructive">Generation Failed</h3>
              <p className="text-sm text-muted-foreground">Something went wrong. Please try again.</p>
            </div>
            <Button
              onClick={() => setState("idle")}
              variant="outline"
              className="border-border/60 gap-2"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-xl p-4 border border-border/40">
          <p className="text-xs text-muted-foreground mb-1">Format</p>
          <p className="font-semibold text-sm uppercase">{style.format}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-border/40">
          <p className="text-xs text-muted-foreground mb-1">Lyrics Lines</p>
          <p className="font-semibold text-sm">{timings.length} synced</p>
        </div>
        <div className="glass rounded-xl p-4 border border-border/40">
          <p className="text-xs text-muted-foreground mb-1">Duration</p>
          <p className="font-semibold text-sm font-mono">{Math.round(audioDuration)}s</p>
        </div>
        <div className="glass rounded-xl p-4 border border-border/40">
          <p className="text-xs text-muted-foreground mb-1">Template</p>
          <p className="font-semibold text-sm capitalize">{style.template}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
