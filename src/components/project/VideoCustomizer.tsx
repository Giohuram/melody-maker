import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Monitor, Square, Tv, Sparkles, Type } from "lucide-react";

export type VideoFormat = "tiktok" | "youtube" | "youtube-full" | "instagram" | "shorts";

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
  { id: "youtube", label: "YT Shorts", icon: Monitor, ratio: "9:16", size: "1080×1920" },
  { id: "youtube-full", label: "YouTube", icon: Tv, ratio: "16:9", size: "1920×1080" },
  { id: "instagram", label: "Instagram", icon: Square, ratio: "1:1", size: "1080×1080" },
];

const templates = [
  { id: "minimal", label: "Minimal", desc: "Épuré & focalisé", preview: "bg-background" },
  { id: "neon", label: "Neon Glow", desc: "Vibrant & électrique", preview: "bg-gradient-primary" },
  { id: "cinematic", label: "Cinématique", desc: "Dramatique & audacieux", preview: "bg-gradient-to-b from-black to-secondary/30" },
  { id: "hiphop", label: "Hip-Hop", desc: "Typo forte, beats lourds", preview: "bg-gradient-to-br from-accent/20 to-background" },
  { id: "lofi", label: "Lo-Fi", desc: "Doux & esthétique", preview: "bg-muted" },
  { id: "karaoke", label: "Karaoké", desc: "Surbrillance mot par mot", preview: "bg-gradient-to-r from-primary/30 to-secondary/30" },
];

const fontStyles = [
  { id: "montserrat", label: "Montserrat", className: "font-heading font-black" },
  { id: "inter", label: "Inter", className: "font-body font-bold" },
  { id: "mono", label: "JetBrains Mono", className: "font-mono font-bold" },
];

const textPositionLabels: Record<string, string> = {
  top: "Haut",
  center: "Centre",
  bottom: "Bas",
};

const transitionLabels: Record<string, string> = {
  fade: "Fondu",
  slide: "Glissement",
  bounce: "Rebond",
};

const VideoCustomizer = ({ style, onChange }: VideoCustomizerProps) => {
  const update = (patch: Partial<VideoStyle>) => onChange({ ...style, ...patch });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="font-heading text-lg sm:text-xl font-bold mb-1">Personnalisez Votre Vidéo</h2>
        <p className="text-sm text-muted-foreground">Choisissez le format, le template et le style de votre vidéo lyrics.</p>
      </div>

      {/* Format */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
          📱 Format d'Export
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
          {formats.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => update({ format: f.id })}
                className={`flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl border transition-all ${
                  style.format === f.id
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border/40 hover:border-border/80 text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs font-bold leading-tight text-center">{f.label}</span>
                <span className="text-xs opacity-60 hidden sm:block">{f.ratio}</span>
              </button>
            );
          })}
        </div>
        {style.format === "youtube-full" && (
          <p className="text-xs text-primary mt-2 glass px-3 py-2 rounded-lg border border-primary/20">
            📺 Format YouTube standard 16:9 — idéal pour les clips lyriques complets
          </p>
        )}
      </div>

      {/* Template */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Template Visuel
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
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
              <div className={`h-12 sm:h-14 ${t.preview} flex items-center justify-center`}>
                <span className="font-heading text-xs sm:text-sm font-black opacity-80">{t.label}</span>
              </div>
              <div className="p-1.5 sm:p-2 text-left">
                <p className="text-xs font-semibold">{t.label}</p>
                <p className="text-xs text-muted-foreground hidden sm:block">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Type className="w-3.5 h-3.5" />
          Style de Police
        </label>
        <div className="flex gap-2 flex-wrap">
          {fontStyles.map((f) => (
            <button
              key={f.id}
              onClick={() => update({ fontStyle: f.id })}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm transition-all ${f.className} ${
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
          📍 Position du Texte
        </label>
        <div className="flex gap-2">
          {(["top", "center", "bottom"] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => update({ textPosition: pos })}
              className={`flex-1 py-2 sm:py-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                style.textPosition === pos
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border/40 hover:border-border/80 text-muted-foreground"
              }`}
            >
              {textPositionLabels[pos]}
            </button>
          ))}
        </div>
      </div>

      {/* Transition */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
          ✨ Transition de Texte
        </label>
        <div className="flex gap-2">
          {(["fade", "slide", "bounce"] as const).map((trans) => (
            <button
              key={trans}
              onClick={() => update({ transition: trans })}
              className={`flex-1 py-2 sm:py-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                style.transition === trans
                  ? "border-secondary/60 bg-secondary/10 text-secondary"
                  : "border-border/40 hover:border-border/80 text-muted-foreground"
              }`}
            >
              {transitionLabels[trans]}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => update({ karaoke: !style.karaoke })}
          className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border transition-all ${
            style.karaoke
              ? "border-accent/60 bg-accent/10 text-accent"
              : "border-border/40 text-muted-foreground hover:border-border/80"
          }`}
        >
          <span className="text-base sm:text-lg">🎤</span>
          <div className="text-left">
            <p className="text-xs font-bold">Mode Karaoké</p>
            <p className="text-xs opacity-60 hidden sm:block">Mot par mot</p>
          </div>
        </button>
        <button
          onClick={() => update({ showProgress: !style.showProgress })}
          className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border transition-all ${
            style.showProgress
              ? "border-primary/60 bg-primary/10 text-primary"
              : "border-border/40 text-muted-foreground hover:border-border/80"
          }`}
        >
          <span className="text-base sm:text-lg">📊</span>
          <div className="text-left">
            <p className="text-xs font-bold">Barre Progress</p>
            <p className="text-xs opacity-60 hidden sm:block">Afficher la durée</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default VideoCustomizer;
