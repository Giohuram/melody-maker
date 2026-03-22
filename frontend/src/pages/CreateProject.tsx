import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import AudioUploader from "@/components/project/AudioUploader";
import LyricsEditor from "@/components/project/LyricsEditor";
import SyncTimeline from "@/components/project/SyncTimeline";
import VideoCustomizer, { type VideoStyle } from "@/components/project/VideoCustomizer";
import VideoPreview from "@/components/project/VideoPreview";
import VideoGenerator from "@/components/project/VideoGenerator";

interface UploadedFile { file: File; url: string; duration?: number; }
interface LyricTiming { text: string; startTime: number; endTime: number; orderIndex: number; }

const STEPS = ["Upload", "Paroles", "Sync", "Style", "Aperçu", "Export"];

const CreateProject = () => {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audio, setAudio] = useState<UploadedFile | null>(null);
  const [cover, setCover] = useState<UploadedFile | null>(null);
  const [lyrics, setLyrics] = useState<string[]>([]);
  const [timings, setTimings] = useState<LyricTiming[]>([]);
  const [syncMethod, setSyncMethod] = useState<"auto" | "manual">("auto");
  const [style, setStyle] = useState<VideoStyle>({
    format: "tiktok", template: "neon", fontStyle: "montserrat",
    textPosition: "center", transition: "fade", showProgress: false, karaoke: false, textColor: "#FFFFFF",
  });

  const canNext = () => {
    if (step === 0) return !!audio && !!cover;
    if (step === 1) return lyrics.length > 0;
    if (step === 2) return timings.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Titre de la chanson..."
                className="flex-1 bg-muted/50 border-border/40 font-heading font-bold text-base sm:text-lg h-11"
              />
              <Input
                value={artist}
                onChange={e => setArtist(e.target.value)}
                placeholder="Nom de l'artiste..."
                className="flex-1 bg-muted/50 border-border/40 h-11"
              />
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-0 overflow-x-auto pb-1">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1 min-w-0">
                  <button
                    onClick={() => i < step && setStep(i)}
                    className={`flex items-center gap-1 sm:gap-2 text-xs font-semibold transition-all min-w-0 ${
                      i === step ? "text-primary" :
                      i < step ? "text-muted-foreground cursor-pointer hover:text-foreground" :
                      "text-muted-foreground/40 cursor-not-allowed"
                    }`}
                  >
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs shrink-0 transition-all ${
                      i === step ? "bg-primary text-primary-foreground" :
                      i < step ? "bg-primary/30 text-primary" :
                      "bg-muted/50"
                    }`}>
                      {i < step ? <Check className="w-3 h-3" /> : i + 1}
                    </div>
                    <span className="hidden sm:block truncate">{s}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-1 sm:mx-2 transition-all min-w-[8px] ${i < step ? "bg-primary/40" : "bg-border/30"}`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Step content */}
          <div className="glass rounded-2xl border border-border/40 p-4 sm:p-6 mb-5 sm:mb-6 min-h-[450px] sm:min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && <AudioUploader audio={audio} cover={cover} onAudioChange={setAudio} onCoverChange={setCover} />}
                {step === 1 && <LyricsEditor lyrics={lyrics} onChange={setLyrics} />}
                {step === 2 && (
                  <SyncTimeline
                    lyrics={lyrics}
                    audioDuration={audio?.duration || 180}
                    audioUrl={audio?.url || ""}
                    timings={timings}
                    onTimingsChange={setTimings}
                    syncMethod={syncMethod}
                    onSyncMethodChange={setSyncMethod}
                  />
                )}
                {step === 3 && <VideoCustomizer style={style} onChange={setStyle} />}
                {step === 4 && (
                  <VideoPreview
                    timings={timings}
                    audioUrl={audio?.url || ""}
                    coverUrl={cover?.url || ""}
                    audioDuration={audio?.duration || 180}
                    title={title}
                    artist={artist}
                    style={style}
                  />
                )}
                {step === 5 && (
                  <VideoGenerator
                    audioUrl={audio?.url || ""}
                    coverUrl={cover?.url || ""}
                    timings={timings}
                    audioDuration={audio?.duration || 180}
                    title={title}
                    artist={artist}
                    style={style}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="gap-2 border-border/60 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            {step < STEPS.length - 1 && (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="gap-2 bg-gradient-primary text-primary-foreground border-0 hover:opacity-90 font-semibold text-sm"
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
