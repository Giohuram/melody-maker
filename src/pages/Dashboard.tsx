import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Music2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MoreVertical,
  Play,
  Trash2,
  Copy,
  Download,
  TrendingUp,
  Zap,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/layout/Navbar";

type ProjectStatus = "draft" | "processing" | "completed" | "failed";
type VideoFormat = "tiktok" | "youtube" | "instagram" | "shorts";

interface Project {
  id: string;
  title: string;
  artist: string;
  status: ProjectStatus;
  format: VideoFormat;
  createdAt: string;
  duration: string;
  thumbnail?: string;
}

const mockProjects: Project[] = [
  { id: "1", title: "Summer Vibes", artist: "DJ Nova", status: "completed", format: "tiktok", createdAt: "2025-03-10", duration: "3:42" },
  { id: "2", title: "Midnight Drive", artist: "Luna Beats", status: "processing", format: "youtube", createdAt: "2025-03-09", duration: "4:15" },
  { id: "3", title: "Neon Lights", artist: "CityWave", status: "draft", format: "instagram", createdAt: "2025-03-08", duration: "2:58" },
  { id: "4", title: "Lost in Tokyo", artist: "Yume", status: "completed", format: "shorts", createdAt: "2025-03-07", duration: "0:45" },
  { id: "5", title: "Afrobeats Vol.3", artist: "Afro Kings", status: "failed", format: "tiktok", createdAt: "2025-03-06", duration: "3:20" },
  { id: "6", title: "Electric Dreams", artist: "Synthwave J", status: "completed", format: "youtube", createdAt: "2025-03-05", duration: "5:10" },
];

const statusConfig: Record<ProjectStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
  draft: { label: "Draft", icon: Clock, color: "text-muted-foreground bg-muted" },
  processing: { label: "Processing", icon: Loader2, color: "text-accent bg-accent/10" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-green-400 bg-green-400/10" },
  failed: { label: "Failed", icon: AlertCircle, color: "text-destructive bg-destructive/10" },
};

const formatConfig: Record<VideoFormat, { label: string; ratio: string }> = {
  tiktok: { label: "TikTok", ratio: "9:16" },
  youtube: { label: "YouTube", ratio: "16:9" },
  instagram: { label: "Instagram", ratio: "1:1" },
  shorts: { label: "Shorts", ratio: "9:16" },
};

const stats = [
  { label: "Total Projects", value: "6", icon: Film, color: "text-primary" },
  { label: "Videos Created", value: "3", icon: CheckCircle2, color: "text-green-400" },
  { label: "Credits Left", value: "2", icon: Zap, color: "text-accent" },
  { label: "This Month", value: "4", icon: TrendingUp, color: "text-secondary" },
];

const Dashboard = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");

  const filtered = mockProjects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.artist.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-heading text-3xl font-black">My Projects</h1>
              <p className="text-muted-foreground mt-1">Create and manage your lyrics videos</p>
            </div>
            <Link to="/create">
              <Button className="bg-gradient-primary text-primary-foreground border-0 glow-primary hover:opacity-90 font-semibold gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass rounded-xl p-4 border border-border/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className={`font-heading text-2xl font-black ${stat.color}`}>{stat.value}</div>
                </div>
              );
            })}
          </motion.div>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-muted/50 border-border/40"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "draft", "processing", "completed", "failed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Projects Grid/List */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Music2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No projects found. Create your first one!</p>
              <Link to="/create" className="mt-4 inline-block">
                <Button className="bg-gradient-primary text-primary-foreground border-0 mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-3"}>
              {filtered.map((project, index) => {
                const status = statusConfig[project.status];
                const StatusIcon = status.icon;
                const format = formatConfig[project.format];

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`glass rounded-xl border border-border/40 hover:border-primary/30 transition-all duration-300 group ${
                      view === "list" ? "flex items-center p-4 gap-4" : "p-5"
                    }`}
                  >
                    {/* Thumbnail placeholder */}
                    {view === "grid" && (
                      <div className="w-full h-36 rounded-lg bg-muted/50 mb-4 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
                        <Music2 className="w-10 h-10 text-primary/60" />
                        <div className="absolute bottom-2 right-2 glass px-2 py-0.5 rounded text-xs font-mono text-muted-foreground">
                          {format.ratio}
                        </div>
                        {project.status === "completed" && (
                          <Link to={`/create?project=${project.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40">
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                              <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
                            </div>
                          </Link>
                        )}
                      </div>
                    )}

                    {view === "list" && (
                      <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                        <Music2 className="w-5 h-5 text-primary/60" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-heading font-bold truncate">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">{project.artist}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0 opacity-0 group-hover:opacity-100">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border/60">
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Copy className="w-4 h-4" /> Duplicate
                            </DropdownMenuItem>
                            {project.status === "completed" && (
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Download className="w-4 h-4" /> Download
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                              <Trash2 className="w-4 h-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className={`flex items-center gap-3 mt-3 ${view === "list" ? "" : ""}`}>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                          <StatusIcon className={`w-3.5 h-3.5 ${project.status === "processing" ? "animate-spin" : ""}`} />
                          {status.label}
                        </span>
                        <span className="text-xs text-muted-foreground glass px-2 py-1 rounded-md border border-border/30">
                          {format.label}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto font-mono">{project.duration}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Empty state for new users */}
          {mockProjects.length === 0 && (
            <div className="text-center py-24 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary opacity-20 mx-auto mb-6 flex items-center justify-center">
                <Music2 className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-6">Create your first lyrics video and start going viral.</p>
              <Link to="/create">
                <Button className="bg-gradient-primary text-primary-foreground border-0 gap-2">
                  <Plus className="w-4 h-4" />
                  Create First Project
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
