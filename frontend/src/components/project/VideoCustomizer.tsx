import { motion } from "framer-motion";
import { Smartphone, Monitor, Square, Tv, Sparkles, Type, Music, Palette } from "lucide-react";

export type VideoFormat = "tiktok" | "youtube-full" | "instagram" | "shorts";

export interface VideoStyle {
  format: VideoFormat;
  template: string;
  fontStyle: string;
  textPosition: "top" | "center" | "bottom";
  transition: "fade" | "slide" | "bounce" | "apple-music";
  showProgress: boolean;
  karaoke: boolean;
  textColor: string;
}

interface VideoCustomizerProps {
  style: VideoStyle;
  onChange: (s: VideoStyle) => void;
}

const formats: { id: VideoFormat; label: string; icon: typeof Smartphone; ratio: string; size: string }[] = [
  { id: "tiktok", label: "TikTok", icon: Smartphone, ratio: "9:16", size: "1080×1920" },
  { id: "shorts", label: "YT Shorts", icon: Smartphone, ratio: "9:16", size: "1080×1920" },
  { id: "youtube-full", label: "YouTube", icon: Tv, ratio: "16:9", size: "1920×1080" },
  { id: "instagram", label: "Instagram", icon: Square, ratio: "1:1", size: "1080×1080" },
];

// ─── Templates: purely visual backgrounds ─────────────
const templates = [
  {
    id: "minimal",
    label: "Minimal",
    desc: "Épuré & focalisé",
    previewBg: "bg-[#0c0c14]",
    previewText: "text-white/90",
    previewAccent: "",
  },
  {
    id: "neon",
    label: "Neon Glow",
    desc: "Vibrant & électrique",
    previewBg: "bg-gradient-to-br from-[#1a0025] via-[#0d0015] to-[#120020]",
    previewText: "text-pink-400",
    previewAccent: "shadow-[0_0_15px_rgba(255,0,110,0.5)]",
  },
  {
    id: "cinematic",
    label: "Cinématique",
    desc: "Dramatique & audacieux",
    previewBg: "bg-gradient-to-b from-[#000000] to-[#1a1030]",
    previewText: "text-white/95",
    previewAccent: "",
  },
  {
    id: "hiphop",
    label: "Hip-Hop",
    desc: "Typo forte, beats lourds",
    previewBg: "bg-gradient-to-br from-[#1a1a00] via-[#0d0d00] to-[#0a0a0a]",
    previewText: "text-yellow-400",
    previewAccent: "",
  },
  {
    id: "lofi",
    label: "Lo-Fi",
    desc: "Doux & esthétique",
    previewBg: "bg-gradient-to-br from-[#1a1520] to-[#0d0a10]",
    previewText: "text-purple-300/90",
    previewAccent: "",
  },
  {
    id: "karaoke",
    label: "Karaoké",
    desc: "Surbrillance mot par mot",
    previewBg: "bg-gradient-to-r from-[#15001a] via-[#0a0012] to-[#001a15]",
    previewText: "text-emerald-400",
    previewAccent: "",
  },
];

// ─── Font styles with sample text ─────────────────────
const fontStyles = [
  { id: "montserrat", label: "Montserrat", className: "font-heading font-black", sample: "FEEL THE BEAT" },
  { id: "inter", label: "Inter", className: "font-body font-bold", sample: "Feel the beat" },
  { id: "mono", label: "JetBrains Mono", className: "font-mono font-bold", sample: "feel_the_beat" },
];

const textPositionLabels: Record<string, string> = {
  top: "Haut",
  center: "Centre",
  bottom: "Bas",
};

// ─── Transitions: how lyrics appear/animate ───────────
const transitions: {
  id: VideoStyle["transition"];
  label: string;
  desc: string;
  icon: string;
}[] = [
  { id: "fade", label: "Fondu", desc: "Apparition douce", icon: "◐" },
  { id: "slide", label: "Glissement", desc: "Glisse de bas en haut", icon: "↑" },
  { id: "bounce", label: "Rebond", desc: "Effet zoom élastique", icon: "◉" },
  { id: "apple-music", label: "Apple Music", desc: "Défilement style Apple Music", icon: "♫" },
];

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

      {/* Template Visuel — with mini preview showing sample lyrics */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Template Visuel
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {templates.map((t) => {
            const isSelected = style.template === t.id;
            return (
              <button
                key={t.id}
                onClick={() => update({ template: t.id })}
                className={`rounded-xl border overflow-hidden transition-all ${
                  isSelected
                    ? "border-primary/60 ring-2 ring-primary/30 scale-[1.02]"
                    : "border-border/40 hover:border-border/60 hover:scale-[1.01]"
                }`}
              >
                {/* Mini visual preview */}
                <div className={`h-16 sm:h-20 ${t.previewBg} relative flex flex-col items-center justify-center gap-0.5 px-2 overflow-hidden`}>
                  {/* Simulated lyric lines */}
                  <div className="w-3/4 h-1 rounded-full bg-white/10 mb-0.5" />
                  <div className={`w-4/5 h-1.5 rounded-full ${isSelected ? "bg-primary/80" : "bg-white/30"} ${t.previewAccent}`} />
                  <div className="w-3/5 h-1 rounded-full bg-white/10 mt-0.5" />
                  {/* Template label overlay */}
                  <span className={`absolute inset-0 flex items-center justify-center font-heading text-xs sm:text-sm font-black ${t.previewText} drop-shadow-lg`}>
                    {t.label}
                  </span>
                </div>
                <div className="p-1.5 sm:p-2 text-left bg-background/80">
                  <p className="text-xs font-semibold">{t.label}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Style — with live sample text */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Type className="w-3.5 h-3.5" />
          Style de Police
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {fontStyles.map((f) => {
            const isSelected = style.fontStyle === f.id;
            return (
              <button
                key={f.id}
                onClick={() => update({ fontStyle: f.id })}
                className={`flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl border transition-all ${
                  isSelected
                    ? "border-primary/60 bg-primary/10"
                    : "border-border/40 hover:border-border/80"
                }`}
              >
                <span className={`${f.className} text-base sm:text-lg leading-tight ${isSelected ? "text-primary" : "text-foreground/80"}`}>
                  {f.sample}
                </span>
                <span className={`text-xs ${isSelected ? "text-primary/70" : "text-muted-foreground"}`}>
                  {f.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Text position — with visual indicator */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
          📍 Position du Texte
        </label>
        <div className="flex gap-2">
          {(["top", "center", "bottom"] as const).map((pos) => {
            const isSelected = style.textPosition === pos;
            return (
              <button
                key={pos}
                onClick={() => update({ textPosition: pos })}
                className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 sm:py-3 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border/40 hover:border-border/80 text-muted-foreground"
                }`}
              >
                {/* Mini position indicator */}
                <div className="w-8 h-10 rounded border border-current/30 flex flex-col items-center justify-between py-1 px-1">
                  <div className={`w-full h-0.5 rounded-full ${pos === "top" ? (isSelected ? "bg-primary" : "bg-current") : "bg-current/20"}`} />
                  <div className={`w-full h-0.5 rounded-full ${pos === "center" ? (isSelected ? "bg-primary" : "bg-current") : "bg-current/20"}`} />
                  <div className={`w-full h-0.5 rounded-full ${pos === "bottom" ? (isSelected ? "bg-primary" : "bg-current") : "bg-current/20"}`} />
                </div>
                <span>{textPositionLabels[pos]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transition de Texte — with Apple Music option */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Music className="w-3.5 h-3.5" />
          Transition de Texte
        </label>
        <div className="grid grid-cols-2 gap-2">
          {transitions.map((trans) => {
            const isSelected = style.transition === trans.id;
            const isApple = trans.id === "apple-music";
            return (
              <button
                key={trans.id}
                onClick={() => update({ transition: trans.id })}
                className={`flex items-center gap-2.5 p-3 sm:p-3.5 rounded-xl border transition-all text-left ${
                  isSelected
                    ? isApple
                      ? "border-pink-500/60 bg-pink-500/10 ring-1 ring-pink-500/30"
                      : "border-secondary/60 bg-secondary/10 ring-1 ring-secondary/30"
                    : "border-border/40 hover:border-border/80"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 ${
                  isSelected
                    ? isApple ? "bg-pink-500/20 text-pink-400" : "bg-secondary/20 text-secondary"
                    : "bg-muted/50 text-muted-foreground"
                }`}>
                  {trans.icon}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${
                    isSelected
                      ? isApple ? "text-pink-400" : "text-secondary"
                      : "text-foreground/80"
                  }`}>
                    {trans.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{trans.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        {style.transition === "apple-music" && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-pink-400 mt-2 glass px-3 py-2 rounded-lg border border-pink-500/20"
          >
            ♫ Style Apple Music — Les paroles défilent avec la ligne active surlignée et mise en avant progressivement.
          </motion.p>
        )}
      </div>

      {/* Text Color */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Palette className="w-3.5 h-3.5" />
          Couleur du Texte
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "#FFFFFF", label: "Blanc", bg: "bg-white", ring: "ring-white/50" },
            { id: "#FFD700", label: "Or", bg: "bg-yellow-400", ring: "ring-yellow-400/50" },
            { id: "#FF006E", label: "Rose", bg: "bg-pink-500", ring: "ring-pink-500/50" },
            { id: "#00D4FF", label: "Cyan", bg: "bg-cyan-400", ring: "ring-cyan-400/50" },
            { id: "#A855F7", label: "Violet", bg: "bg-purple-500", ring: "ring-purple-500/50" },
            { id: "#4ADE80", label: "Vert", bg: "bg-green-400", ring: "ring-green-400/50" },
            { id: "#FB923C", label: "Orange", bg: "bg-orange-400", ring: "ring-orange-400/50" },
          ].map((c) => {
            const isSelected = style.textColor === c.id;
            return (
              <button
                key={c.id}
                onClick={() => update({ textColor: c.id })}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                  isSelected
                    ? `border-white/30 ${c.ring} ring-2 bg-white/5`
                    : "border-border/40 hover:border-border/80"
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${c.bg} border border-white/20`} />
                <span className={`text-xs font-semibold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>{c.label}</span>
              </button>
            );
          })}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/40">
            <input
              type="color"
              value={style.textColor || "#FFFFFF"}
              onChange={(e) => update({ textColor: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
            />
            <span className="text-xs text-muted-foreground font-semibold">Custom</span>
          </div>
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
