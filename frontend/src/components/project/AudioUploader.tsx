import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Music2, Image, X, CheckCircle2, FileAudio, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadedFile {
  file: File;
  url: string;
  duration?: number;
}

interface AudioUploaderProps {
  onAudioChange: (file: UploadedFile | null) => void;
  onCoverChange: (file: UploadedFile | null) => void;
  audio: UploadedFile | null;
  cover: UploadedFile | null;
}

const formatDuration = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const DropZone = ({
  accept,
  icon: Icon,
  label,
  hint,
  file,
  onFile,
  onRemove,
  color = "primary",
}: {
  accept: string;
  icon: typeof Music2;
  label: string;
  hint: string;
  file: UploadedFile | null;
  onFile: (f: UploadedFile) => void;
  onRemove: () => void;
  color?: "primary" | "secondary";
}) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) processFile(f);
    },
    []
  );

  const processFile = (f: File) => {
    const url = URL.createObjectURL(f);
    if (f.type.startsWith("audio/")) {
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        onFile({ file: f, url, duration: audio.duration });
      };
    } else {
      onFile({ file: f, url });
    }
  };

  const accentClass = color === "primary" ? "border-primary/50 bg-primary/5" : "border-secondary/50 bg-secondary/5";
  const iconClass = color === "primary" ? "text-primary" : "text-secondary";

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
        file ? "border-border/40 bg-muted/20" : dragging ? `${accentClass}` : "border-border/40 hover:border-border/80 hover:bg-muted/10"
      }`}
      onClick={() => !file && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
      />

      {!file ? (
        <div className="p-8 text-center">
          <div className={`w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-4 ${dragging ? iconClass : "text-muted-foreground"} transition-colors`}>
            <Icon className="w-7 h-7" />
          </div>
          <p className="font-semibold text-sm mb-1">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      ) : (
        <div className="p-5 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color === "primary" ? "bg-primary/10" : "bg-secondary/10"}`}>
            <Icon className={`w-6 h-6 ${iconClass}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{file.file.name}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-muted-foreground">
                {(file.file.size / 1024 / 1024).toFixed(1)} MB
              </span>
              {file.duration && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(file.duration)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="p-1 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Animated waveform bars
const WaveformPreview = ({ audioUrl }: { audioUrl: string }) => {
  const bars = Array.from({ length: 60 }, () => Math.random() * 80 + 20);
  return (
    <div className="mt-4 glass rounded-xl p-4 border border-border/40">
      <div className="flex items-center gap-2 mb-3">
        <Music2 className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">Audio Preview</span>
      </div>
      <div className="flex items-center gap-0.5 h-12">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-primary rounded-sm opacity-70 wave-bar"
            style={{
              height: `${h}%`,
              animationDelay: `${i * 0.03}s`,
            }}
          />
        ))}
      </div>
      <audio src={audioUrl} controls className="w-full mt-3 h-8 opacity-70" style={{ filter: "invert(0) hue-rotate(270deg)" }} />
    </div>
  );
};

const AudioUploader = ({ onAudioChange, onCoverChange, audio, cover }: AudioUploaderProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold mb-1">Upload Your Files</h2>
        <p className="text-sm text-muted-foreground">Add your audio track and cover art to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
            🎵 Audio Track *
          </label>
          <DropZone
            accept="audio/mp3,audio/wav,audio/m4a,audio/aac,audio/*"
            icon={FileAudio}
            label="Drop your audio here"
            hint="MP3, WAV, M4A, AAC — up to 50MB"
            file={audio}
            onFile={onAudioChange}
            onRemove={() => onAudioChange(null)}
            color="primary"
          />
          {audio && <WaveformPreview audioUrl={audio.url} />}
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
            🖼️ Cover Art *
          </label>
          <DropZone
            accept="image/jpeg,image/png,image/webp"
            icon={Image}
            label="Drop your cover art here"
            hint="JPG, PNG, WebP — up to 10MB"
            file={cover}
            onFile={onCoverChange}
            onRemove={() => onCoverChange(null)}
            color="secondary"
          />
          {cover && (
            <div className="mt-4 glass rounded-xl p-2 border border-border/40">
              <img
                src={cover.url}
                alt="Cover"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="glass rounded-xl p-4 border border-border/30">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">💡 Tips</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use high-quality audio (320kbps MP3 or WAV) for best results</li>
          <li>• Square cover art (1:1) works best across all formats</li>
          <li>• Minimum cover size: 500×500px recommended</li>
        </ul>
      </div>
    </div>
  );
};

export default AudioUploader;
