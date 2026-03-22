import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MessageCircle, Share2, Bookmark, Music2,
  Play, Pause, Volume2, VolumeX, ChevronUp, ChevronDown,
  Repeat2, Send, MoreHorizontal, Verified, TrendingUp,
  Search, Bell, Plus, Zap, Radio
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";

interface FeedPost {
  id: string;
  user: { name: string; handle: string; avatar: string; verified: boolean };
  song: string;
  artist: string;
  format: string;
  likes: number;
  comments: number;
  shares: number;
  views: string;
  caption: string;
  tags: string[];
  liked: boolean;
  saved: boolean;
  gradient: string;
  lyricsPreview: string[];
  duration: string;
}

const mockPosts: FeedPost[] = [
  {
    id: "1",
    user: { name: "DJ Nova", handle: "@djnova", avatar: "N", verified: true },
    song: "Summer Vibes",
    artist: "DJ Nova",
    format: "TikTok",
    likes: 12400,
    comments: 342,
    shares: 1200,
    views: "248K",
    caption: "Mon nouveau son d'été est là 🌊🔥 Partagez si vous kiffez !",
    tags: ["#SummerVibes", "#NewMusic", "#HipHop"],
    liked: false,
    saved: false,
    gradient: "from-primary/80 via-secondary/60 to-background",
    lyricsPreview: ["☀️ The sun is calling", "Feel the summer in your soul", "We're dancing till the morning glow"],
    duration: "3:42",
  },
  {
    id: "2",
    user: { name: "Luna Beats", handle: "@lunabeats", avatar: "L", verified: false },
    song: "Midnight Drive",
    artist: "Luna Beats",
    format: "YouTube",
    likes: 8700,
    comments: 215,
    shares: 780,
    views: "112K",
    caption: "Pour tous ceux qui roulent la nuit 🌙🚗 Vibe nocturne absolue.",
    tags: ["#MidnightVibes", "#LoFi", "#NightDrive"],
    liked: true,
    saved: true,
    gradient: "from-secondary/80 via-accent/30 to-background",
    lyricsPreview: ["🌙 City lights blur past", "Racing through the dark abyss", "Nothing but the beat and road"],
    duration: "4:15",
  },
  {
    id: "3",
    user: { name: "Afro Kings", handle: "@afrokings", avatar: "A", verified: true },
    song: "Afrobeats Vol.3",
    artist: "Afro Kings",
    format: "Instagram",
    likes: 24300,
    comments: 891,
    shares: 3400,
    views: "1.2M",
    caption: "Vol.3 est enfin là ! Le son qui va faire bouger toute l'Afrique 🌍🥁",
    tags: ["#Afrobeats", "#AfroKings", "#Viral"],
    liked: false,
    saved: false,
    gradient: "from-accent/80 via-primary/40 to-background",
    lyricsPreview: ["🥁 Shakete shakete", "Feel the rhythm in your chest", "Africa rising, we manifest"],
    duration: "3:20",
  },
  {
    id: "4",
    user: { name: "Yume", handle: "@yumemusic", avatar: "Y", verified: false },
    song: "Lost in Tokyo",
    artist: "Yume",
    format: "Shorts",
    likes: 6200,
    comments: 178,
    shares: 450,
    views: "89K",
    caption: "Tokyo by night, une vibe unique 🗼✨ Créé avec LyricWave !",
    tags: ["#Tokyo", "#CityPop", "#Japan"],
    liked: false,
    saved: false,
    gradient: "from-secondary/60 via-primary/40 to-background",
    lyricsPreview: ["🗼 Neon signs reflect", "Lost in Tokyo's embrace", "Every street a new dream chased"],
    duration: "0:45",
  },
];

const formatNumber = (n: number) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

const PostCard = ({ post, isActive }: { post: FeedPost; isActive: boolean }) => {
  const [liked, setLiked] = useState(post.liked);
  const [saved, setSaved] = useState(post.saved);
  const [likes, setLikes] = useState(post.likes);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: isActive ? 1 : 0.95, opacity: isActive ? 1 : 0.6 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-sm mx-auto glass rounded-3xl border border-border/40 overflow-hidden"
        style={{ height: "min(75vh, 600px)" }}
      >
        {/* Video-like background */}
        <div className={`absolute inset-0 bg-gradient-to-b ${post.gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Music note decorations */}
        <div className="absolute top-4 left-4 right-4 flex justify-between opacity-20">
          <span className="text-2xl">♫</span>
          <span className="text-2xl">♪</span>
        </div>

        {/* Animated wave bars in background */}
        <div className="absolute inset-x-0 top-1/3 flex items-center justify-center gap-0.5 h-20 opacity-10 pointer-events-none">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="w-0.5 bg-foreground rounded-full wave-bar"
              style={{ height: `${Math.random() * 50 + 10}px`, animationDelay: `${i * 0.06}s` }}
            />
          ))}
        </div>

        {/* Lyrics preview */}
        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center space-y-3">
          {post.lyricsPreview.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isActive ? [0.4, 1, 0.4] : 0.4, y: 0 }}
              transition={{ duration: 2, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }}
              className={`font-heading font-black text-foreground ${i === 1 ? "text-xl text-glow-primary" : "text-base opacity-70"}`}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-16 p-5">
          {/* User */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center font-heading font-black text-primary-foreground text-sm shrink-0">
              {post.user.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold truncate">{post.user.name}</span>
                {post.user.verified && <Verified className="w-3.5 h-3.5 text-primary shrink-0" />}
              </div>
              <span className="text-xs text-muted-foreground">{post.user.handle}</span>
            </div>
            <button className="ml-auto glass border border-primary/40 text-primary text-xs font-bold px-3 py-1 rounded-full hover:bg-primary/10 transition-colors shrink-0">
              + Suivre
            </button>
          </div>

          {/* Caption */}
          <p className="text-sm text-foreground/90 mb-2 line-clamp-2">{post.caption}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-primary font-medium">{tag}</span>
            ))}
          </div>

          {/* Song info */}
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-border/30">
            <div className="w-7 h-7 bg-gradient-primary rounded-lg flex items-center justify-center shrink-0 animate-spin" style={{ animationDuration: "4s" }}>
              <Music2 className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate">{post.song}</p>
              <p className="text-xs text-muted-foreground truncate">{post.artist}</p>
            </div>
            <span className="text-xs glass px-2 py-0.5 rounded-md border border-border/30 text-muted-foreground shrink-0">{post.format}</span>
          </div>
        </div>

        {/* Right action bar */}
        <div className="absolute right-3 bottom-16 flex flex-col items-center gap-5">
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 group"
          >
            <motion.div
              whileTap={{ scale: 1.4 }}
              className={`w-11 h-11 rounded-full glass border flex items-center justify-center transition-all ${
                liked ? "border-primary/60 bg-primary/20 text-primary" : "border-border/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            </motion.div>
            <span className="text-xs text-muted-foreground font-mono">{formatNumber(likes)}</span>
          </button>

          <button onClick={() => setShowComments(!showComments)} className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full glass border border-border/40 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-xs text-muted-foreground font-mono">{formatNumber(post.comments)}</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full glass border border-border/40 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-xs text-muted-foreground font-mono">{formatNumber(post.shares)}</span>
          </button>

          <button
            onClick={() => setSaved(!saved)}
            className={`flex flex-col items-center gap-1`}
          >
            <div className={`w-11 h-11 rounded-full glass border flex items-center justify-center transition-all ${
              saved ? "border-accent/60 bg-accent/20 text-accent" : "border-border/40 text-muted-foreground hover:text-foreground"
            }`}>
              <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
            </div>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full glass border border-border/40 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Play button overlay */}
        <button
          onClick={() => setPlaying(!playing)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity"
        >
          <div className="w-16 h-16 rounded-full glass border border-border/60 flex items-center justify-center">
            {playing ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
          </div>
        </button>

        {/* Mute button */}
        <button
          onClick={() => setMuted(!muted)}
          className="absolute top-4 right-4 w-8 h-8 glass rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {/* Views badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 glass px-3 py-1 rounded-full border border-border/30 text-xs text-muted-foreground font-mono">
          👁 {post.views} vues
        </div>

        {/* Comments panel */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="absolute inset-0 glass-heavy rounded-3xl p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg">Commentaires</h3>
                <button onClick={() => setShowComments(false)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto">
                {[
                  { name: "Marie L.", text: "Incroyable ce son ! 🔥", time: "2h" },
                  { name: "Kofi B.", text: "LyricWave c'est la meilleure plateforme !", time: "3h" },
                  { name: "Sophie T.", text: "J'adore le mode karaoké 🎤", time: "5h" },
                ].map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                      {c.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{c.name}</span>
                        <span className="text-xs text-muted-foreground">{c.time}</span>
                      </div>
                      <p className="text-sm">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="flex-1 bg-muted/50 border-border/40 h-10 rounded-xl text-sm"
                />
                <Button size="sm" className="bg-gradient-primary text-primary-foreground border-0 px-3 rounded-xl">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const Feed = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"pour-toi" | "tendances" | "abonnements">("pour-toi");

  const goNext = () => setActiveIndex((i) => Math.min(i + 1, mockPosts.length - 1));
  const goPrev = () => setActiveIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 min-h-screen flex flex-col">
        {/* Feed header tabs */}
        <div className="sticky top-16 z-40 glass-heavy border-b border-border/30">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="flex items-center justify-between py-3 gap-3">
              <div className="flex gap-1 flex-1">
                {(["pour-toi", "tendances", "abonnements"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all capitalize ${
                      activeTab === tab
                        ? "bg-gradient-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "pour-toi" ? "Pour Toi" : tab === "tendances" ? "🔥 Tendances" : "Abonnements"}
                  </button>
                ))}
              </div>
              <Link to="/create">
                <Button size="sm" className="bg-gradient-primary text-primary-foreground border-0 hover:opacity-90 font-semibold gap-1 shrink-0 rounded-xl px-3">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Créer</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main feed area */}
        <div className="flex-1 container mx-auto px-4 max-w-2xl py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feed scroll area */}
            <div className="lg:col-span-2">
              <div className="relative" style={{ height: "min(80vh, 700px)" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <PostCard post={mockPosts[activeIndex]} isActive={true} />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation arrows */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 -mr-4 z-20 hidden sm:flex">
                  <button
                    onClick={goPrev}
                    disabled={activeIndex === 0}
                    className="w-9 h-9 glass rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={goNext}
                    disabled={activeIndex === mockPosts.length - 1}
                    className="w-9 h-9 glass rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {mockPosts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`rounded-full transition-all ${
                        i === activeIndex ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-muted-foreground/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile nav buttons */}
              <div className="flex justify-center gap-4 mt-4 sm:hidden">
                <button
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                  className="flex items-center gap-2 glass border border-border/40 px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-30"
                >
                  <ChevronUp className="w-4 h-4" /> Précédent
                </button>
                <button
                  onClick={goNext}
                  disabled={activeIndex === mockPosts.length - 1}
                  className="flex items-center gap-2 glass border border-border/40 px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-30"
                >
                  Suivant <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sidebar — trending & suggestions (desktop only) */}
            <div className="hidden lg:block space-y-4">
              {/* Trending */}
              <div className="glass rounded-2xl border border-border/40 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="font-heading font-bold text-sm">Tendances</h3>
                </div>
                <div className="space-y-3">
                  {["#Afrobeats", "#SummerHits", "#NightVibes", "#KaraokeMode", "#NewMusic"].map((tag, i) => (
                    <div key={tag} className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-primary font-semibold">{tag}</p>
                        <p className="text-xs text-muted-foreground">{(Math.random() * 50 + 10).toFixed(1)}K vidéos</p>
                      </div>
                      <span className="text-xs glass px-2 py-0.5 rounded border border-border/30 text-muted-foreground">#{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested artists */}
              <div className="glass rounded-2xl border border-border/40 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Radio className="w-4 h-4 text-secondary" />
                  <h3 className="font-heading font-bold text-sm">Artistes suggérés</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "CityWave", handle: "@citywave", avatar: "C" },
                    { name: "Synthwave J", handle: "@synthj", avatar: "S" },
                    { name: "Neo Beats", handle: "@neobeats", avatar: "N" },
                  ].map((artist) => (
                    <div key={artist.handle} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-black text-primary-foreground shrink-0">
                        {artist.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{artist.name}</p>
                        <p className="text-xs text-muted-foreground">{artist.handle}</p>
                      </div>
                      <button className="text-xs border border-primary/40 text-primary px-3 py-1 rounded-full hover:bg-primary/10 transition-colors">
                        Suivre
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create CTA */}
              <div className="glass rounded-2xl border border-primary/30 p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
                <Zap className="w-5 h-5 text-primary mb-2" />
                <h3 className="font-heading font-bold text-sm mb-1">Partagez votre son</h3>
                <p className="text-xs text-muted-foreground mb-3">Créez une vidéo lyrics et rejoignez le fil d'actualité.</p>
                <Link to="/create">
                  <Button size="sm" className="w-full bg-gradient-primary text-primary-foreground border-0 hover:opacity-90 font-semibold text-xs rounded-xl">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Créer maintenant
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
