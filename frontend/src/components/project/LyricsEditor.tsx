import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Trash2, Hash, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface LyricsEditorProps {
  lyrics: string[];
  onChange: (lines: string[]) => void;
}

const LyricsEditor = ({ lyrics, onChange }: LyricsEditorProps) => {
  const [rawText, setRawText] = useState(lyrics.join("\n"));
  const fileRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (val: string) => {
    setRawText(val);
    const lines = val.split("\n").filter((l) => l.trim().length > 0);
    onChange(lines);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      let content = ev.target?.result as string;
      // Strip .lrc timestamps [00:00.00]
      content = content.replace(/\[\d+:\d+\.\d+\]/g, "").trim();
      setRawText(content);
      const lines = content.split("\n").filter((l) => l.trim().length > 0);
      onChange(lines);
    };
    reader.readAsText(file);
  };

  const lines = rawText.split("\n");
  const wordCount = lyrics.reduce((acc, l) => acc + l.split(" ").filter(Boolean).length, 0);
  const lineCount = lyrics.length;

  const exampleLyrics = `Verse 1:
I see the city lights below
Neon signs in the overflow
Every beat a story told
Every word a chest of gold

Chorus:
Ride the wave, feel the sound
Lyrics flying all around
Turn the music up so high
Watch our words light up the sky`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold mb-1">Add Your Lyrics</h2>
        <p className="text-sm text-muted-foreground">Type, paste, or import your song lyrics below.</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          className="gap-2 border-border/60"
        >
          <Upload className="w-4 h-4" />
          Import .txt / .lrc
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.lrc"
          className="hidden"
          onChange={handleFileImport}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setRawText(""); onChange([]); }}
          className="gap-2 border-border/60 text-muted-foreground"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
        {rawText.length === 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleTextChange(exampleLyrics)}
            className="gap-2 text-primary"
          >
            Load example
          </Button>
        )}

        {/* Stats */}
        <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Hash className="w-3.5 h-3.5" />
            {lineCount} lines
          </span>
          <span className="flex items-center gap-1">
            <AlignLeft className="w-3.5 h-3.5" />
            {wordCount} words
          </span>
        </div>
      </div>

      {/* Editor with line numbers */}
      <div className="flex gap-0 glass rounded-xl border border-border/40 overflow-hidden">
        {/* Line numbers */}
        <div className="py-3 px-3 bg-muted/20 border-r border-border/30 select-none min-w-[48px]">
          {lines.map((_, i) => (
            <div key={i} className="font-mono text-xs text-muted-foreground/50 leading-6 text-right">
              {i + 1}
            </div>
          ))}
          {lines.length === 0 && (
            <div className="font-mono text-xs text-muted-foreground/50 leading-6 text-right">1</div>
          )}
        </div>

        {/* Textarea */}
        <Textarea
          value={rawText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={`Verse 1:\nI see the city lights below\nNeon signs in the overflow...\n\nChorus:\nRide the wave, feel the sound...`}
          className="flex-1 border-0 rounded-none bg-transparent font-mono text-sm leading-6 resize-none min-h-[280px] focus-visible:ring-0 focus-visible:ring-offset-0 py-3"
          spellCheck={false}
        />
      </div>

      {/* Preview */}
      {lyrics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 border border-border/40"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            Detected Lines ({lineCount})
          </p>
          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
            {lyrics.map((line, i) => (
              <div key={i} className="flex items-start gap-3 text-sm py-1">
                <span className="font-mono text-xs text-muted-foreground/60 w-6 shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-foreground/80">{line}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <div className="glass rounded-xl p-4 border border-border/30">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">💡 Tips</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Each line will become one synchronized text segment in your video</li>
          <li>• Keep lines short (3–8 words) for better visual impact</li>
          <li>• Use blank lines to separate verses/chorus sections</li>
          <li>• Import .lrc files — timestamps will be auto-stripped</li>
        </ul>
      </div>
    </div>
  );
};

export default LyricsEditor;
