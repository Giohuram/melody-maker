import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Monitor, Square, Sparkles, Type, Palette } from "lucide-react";

export type VideoFormat = "tiktok" | "youtube" | "instagram" | "shorts";

export interface VideoStyle {
  format: VideoFormat;
  template: string;
  fontStyle: string;
  textPosition: "top" | "center" | "bottom";
  transition: "fade" | "slide" | "bounce";
  showProgress: boolean;
  karaoke: boolean;
}

interface VideoCustomizerProps {
  style: VideoStyle;
  onChange: (s: VideoStyle) => void;
}

const formats: { id: VideoFormat; label: string; icon: typeof Smartphone; ratio: string; size: string }[] = [
  { id: "tiktok", label: "TikTok", icon: Smartphone, ratio: "9:16", size: "1080×1920" },
  { id: "shorts", label: "YT Shorts", icon: Smartphone, ratio: "9:16", size: "1080×1920" },
  { id: "youtube", label: "YouTube", icon: Monitor, ratio: "16:9", size: "1920×1080" },
  { id: "instagram", label: "Instagram", icon: Square, ratio: "1:1", size: "1080×1080" },
];

const templates = [
  { id: "minimal", label: "Minimal", desc: "Clean & focused", preview: "bg-background" },
  { id: "neon", label: "Neon Glow", desc: "Vibrant & electric", preview: "bg-gradient-primary" },
  { id: "cinematic", label: "Cinematic", desc: "Bold & dramatic", preview: "bg-gradient-to-b from-black to-secondary/30" },
  { id: "hiphop", label: "Hip-Hop", desc: "Bold type, heavy beats", preview: "bg-gradient-to-br from-accent/20 to-background" },
  { id: "lofi", label: "Lo-Fi", desc: "Muted, aesthetic", preview: "bg-muted" },
  { id: "karaoke", label: "Karaoke", desc: "Word highlight effect", preview: "bg-gradient-to-r from-primary/30 to-secondary/30" },
];

const fontStyles = [
  { id: "montserrat", label: "Montserrat", className: "font-heading font-black" },
  { id: "inter", label: "Inter", className: "font-body font-bold" },
  { id: "mono", label: "JetBrains Mono", className: "font-mono font-bold" },
];

const VideoCustomizer = ({ style, onChange }: VideoCustomizerProps) => {
  const update = (patch: Partial<VideoStyle>) => onChange({ ...style, ...patch });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-xl font-bold mb-1">Customize Your Video</h2>
        <p className="text-sm text-muted-foreground">Choose the format, template, and style for your lyrics video.</p>
      </div>

      {/* Format */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
          📱 Export Format
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {formats.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => update({ format: f.id })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  style.format === f.id
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border/40 hover:border-border/80 text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-bold">{f.label}</span>
                <span className="text-xs opacity-60">{f.ratio}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Template */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Visual Template
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => update({ template: t.id })}
              className={`rounded-xl border overflow-hidden transition-all ${
                style.template === t.id
                  ? "border-primary/60 ring-1 ring-primary/40"
                  : "border-border/40 hover:border-border/80"
              }`}
            >
              <div className={`h-14 ${t.preview} flex items-center justify-center`}>
                <span className="font-heading text-sm font-black opacity-80">{t.label}</span>
              </div>
              <div className="p-2 text-left">
                <p className="text-xs font-semibold">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block flex items-center gap-2">
          <Type className="w-3.5 h-3.5" />
          Font Style
        </label>
        <div className="flex gap-2 flex-wrap">
          {fontStyles.map((f) => (
            <button
              key={f.id}
              onClick={() => update({ fontStyle: f.id })}
              className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${f.className} ${
                style.fontStyle === f.id
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border/40 hover:border-border/80 text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text position */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
          📍 Text Position
        </label>
        <div className="flex gap-2">
          {(["top", "center", "bottom"] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => update({ textPosition: pos })}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                style.textPosition === pos
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border/40 hover:border-border/80 text-muted-foreground"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Transition */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
          ✨ Text Transition
        </label>
        <div className="flex gap-2">
          {(["fade", "slide", "bounce"] as const).map((trans) => (
            <button
              key={trans}
              onClick={() => update({ transition: trans })}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                style.transition === trans
                  ? "border-secondary/60 bg-secondary/10 text-secondary"
                  : "border-border/40 hover:border-border/80 text-muted-foreground"
              }`}
            >
              {trans}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => update({ karaoke: !style.karaoke })}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
            style.karaoke
              ? "border-accent/60 bg-accent/10 text-accent"
              : "border-border/40 text-muted-foreground hover:border-border/80"
          }`}
        >
          <span className="text-lg">🎤</span>
          <div className="text-left">
            <p className="text-xs font-bold">Karaoke Mode</p>
            <p className="text-xs opacity-60">Word highlight</p>
          </div>
        </button>
        <button
          onClick={() => update({ showProgress: !style.showProgress })}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
            style.showProgress
              ? "border-primary/60 bg-primary/10 text-primary"
              : "border-border/40 text-muted-foreground hover:border-border/80"
          }`}
        >
          <span className="text-lg">📊</span>
          <div className="text-left">
            <p className="text-xs font-bold">Progress Bar</p>
            <p className="text-xs opacity-60">Show time bar</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default VideoCustomizer;
