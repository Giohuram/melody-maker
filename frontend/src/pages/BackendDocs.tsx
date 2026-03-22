import { useState } from "react";
import { motion } from "framer-motion";
import {
  Server, Database, Lock, Upload, Music2, Film, Zap,
  Code2, Terminal, GitBranch, Package, Shield, Globe,
  ChevronRight, Copy, CheckCheck, BookOpen, Layers,
  ArrowRight, ExternalLink, Cpu, HardDrive, Cloud,
  Key, RefreshCw, FileCode, Settings, AlertTriangle,
  Users, CreditCard, Wifi,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

// ──────────────────────────────────────────────
//  Code Block Component
// ──────────────────────────────────────────────
const CodeBlock = ({ code, lang = "bash" }: { code: string; lang?: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative rounded-xl overflow-hidden border border-border/40 my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border/30">
        <span className="text-xs font-mono text-muted-foreground">{lang}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copié !" : "Copier"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm bg-background/80">
        <code className="font-mono text-foreground/90 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
};

// ──────────────────────────────────────────────
//  Section Title
// ──────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, title, subtitle, color = "text-primary" }: {
  icon: typeof Server; title: string; subtitle?: string; color?: string;
}) => (
  <div className="flex items-start gap-4 mb-6">
    <div className={`w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h2 className="font-heading text-xl sm:text-2xl font-bold">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

// ──────────────────────────────────────────────
//  Endpoint Row
// ──────────────────────────────────────────────
const Endpoint = ({ method, path, desc, auth = false }: {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  desc: string;
  auth?: boolean;
}) => {
  const colors: Record<string, string> = {
    GET: "bg-green-500/15 text-green-400 border-green-500/30",
    POST: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    PUT: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    PATCH: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-border/20 last:border-0">
      <span className={`inline-flex items-center justify-center text-xs font-bold font-mono px-2.5 py-1 rounded-md border w-16 shrink-0 ${colors[method]}`}>
        {method}
      </span>
      <code className="font-mono text-sm text-accent shrink-0">{path}</code>
      <span className="text-sm text-muted-foreground flex-1">{desc}</span>
      {auth && (
        <span className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20 shrink-0">
          <Lock className="w-3 h-3" /> JWT
        </span>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────
//  TOC Item
// ──────────────────────────────────────────────
const tocItems = [
  { id: "overview", label: "Vue d'ensemble", icon: BookOpen },
  { id: "stack", label: "Stack technique", icon: Layers },
  { id: "structure", label: "Structure du projet", icon: GitBranch },
  { id: "env", label: "Variables d'environnement", icon: Key },
  { id: "database", label: "Base de données", icon: Database },
  { id: "auth", label: "Authentification", icon: Lock },
  { id: "endpoints", label: "Endpoints API", icon: Globe },
  { id: "upload", label: "Upload de fichiers", icon: Upload },
  { id: "video", label: "Génération vidéo", icon: Film },
  { id: "cors", label: "CORS & Sécurité", icon: Shield },
  { id: "connect", label: "Connecter au frontend", icon: Wifi },
  { id: "deploy", label: "Déploiement", icon: Cloud },
];

// ──────────────────────────────────────────────
//  Main Component
// ──────────────────────────────────────────────
const BackendDocs = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <div className="border-b border-border/40 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-4">
                <FileCode className="w-4 h-4 text-primary" />
                <span>docs</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-primary">backend-guide</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
                Guide d'intégration{" "}
                <span className="bg-clip-text text-transparent bg-gradient-primary">Backend Express.js</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-6">
                Documentation complète pour créer, configurer et connecter le backend Express.js au frontend LyricWave.
                Ce guide est destiné aux développeurs backend qui rejoignent l'équipe.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Express.js", "TypeScript", "PostgreSQL", "Prisma", "JWT", "Multer", "Redis"].map((tag) => (
                  <span key={tag} className="text-xs font-mono px-3 py-1.5 rounded-full bg-muted border border-border/40 text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Sidebar TOC ── */}
            <aside className="lg:w-56 shrink-0">
              <div className="lg:sticky lg:top-24 glass rounded-xl border border-border/40 p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
                  Sommaire
                </p>
                <nav className="space-y-0.5">
                  {tocItems.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-all text-left ${
                        activeSection === id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* ── Content ── */}
            <main className="flex-1 min-w-0 space-y-16">

              {/* ════════════════════════════════════════
                  1. VUE D'ENSEMBLE
              ════════════════════════════════════════ */}
              <section id="overview">
                <SectionTitle icon={BookOpen} title="Vue d'ensemble de l'architecture" subtitle="Comment le frontend LyricWave communique avec le backend" />
                <div className="glass rounded-2xl border border-border/40 p-5 sm:p-6">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Le frontend LyricWave (React + Vite) est entièrement découplé du backend. Il communique via une
                    <strong className="text-foreground"> API REST </strong>
                    hébergée sur un serveur Express.js séparé. Le frontend attend un backend disponible sur une URL
                    configurable via la variable d'environnement <code className="text-accent font-mono text-xs bg-muted/50 px-1.5 py-0.5 rounded">VITE_API_URL</code>.
                  </p>

                  {/* Architecture diagram */}
                  <div className="rounded-xl bg-muted/30 border border-border/30 p-5 font-mono text-xs overflow-x-auto">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center min-w-max mx-auto">
                      <div className="border border-primary/50 rounded-xl p-4 bg-primary/5 w-40">
                        <div className="text-primary font-bold text-sm mb-1">🌐 Frontend</div>
                        <div className="text-muted-foreground">React + Vite</div>
                        <div className="text-muted-foreground">Port 5173</div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <ArrowRight className="w-6 h-6 text-accent rotate-90 sm:rotate-0" />
                        <span className="text-[10px] text-muted-foreground">HTTPS / REST</span>
                        <span className="text-[10px] text-accent">JWT Bearer</span>
                      </div>
                      <div className="border border-secondary/50 rounded-xl p-4 bg-secondary/5 w-40">
                        <div className="text-secondary font-bold text-sm mb-1">⚙️ Backend</div>
                        <div className="text-muted-foreground">Express.js</div>
                        <div className="text-muted-foreground">Port 3001</div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <ArrowRight className="w-6 h-6 text-accent rotate-90 sm:rotate-0" />
                        <span className="text-[10px] text-muted-foreground">Prisma ORM</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="border border-border/50 rounded-xl p-3 bg-muted/30 w-36">
                          <div className="text-xs font-bold mb-0.5">🗄️ PostgreSQL</div>
                          <div className="text-[10px] text-muted-foreground">Données / Auth</div>
                        </div>
                        <div className="border border-border/50 rounded-xl p-3 bg-muted/30 w-36">
                          <div className="text-xs font-bold mb-0.5">📦 Storage</div>
                          <div className="text-[10px] text-muted-foreground">Audio / Images</div>
                        </div>
                        <div className="border border-border/50 rounded-xl p-3 bg-muted/30 w-36">
                          <div className="text-xs font-bold mb-0.5">⚡ Redis</div>
                          <div className="text-[10px] text-muted-foreground">Queue / Cache</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ════════════════════════════════════════
                  2. STACK TECHNIQUE
              ════════════════════════════════════════ */}
              <section id="stack">
                <SectionTitle icon={Layers} title="Stack technique recommandée" color="text-secondary" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Server, label: "Runtime", value: "Node.js 20 LTS", note: "Minimum Node 18" },
                    { icon: Code2, label: "Framework", value: "Express.js 4.x", note: "avec TypeScript" },
                    { icon: Database, label: "ORM", value: "Prisma 5.x", note: "PostgreSQL driver" },
                    { icon: Lock, label: "Auth", value: "JWT + bcryptjs", note: "Refresh tokens" },
                    { icon: Upload, label: "Upload", value: "Multer", note: "Disk / S3 storage" },
                    { icon: Zap, label: "Queue", value: "Bull + Redis", note: "Jobs asynchrones" },
                    { icon: Shield, label: "Sécurité", value: "Helmet + cors", note: "Rate limiting" },
                    { icon: HardDrive, label: "Storage", value: "Supabase Storage", note: "ou AWS S3" },
                  ].map((item) => (
                    <div key={item.label} className="glass rounded-xl border border-border/40 p-4 flex items-start gap-3">
                      <item.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-semibold text-sm">{item.value}</p>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="font-heading text-lg font-bold mt-8 mb-3">Installation des dépendances</h3>
                <CodeBlock lang="bash" code={`# Initialiser le projet
mkdir lyricwave-backend && cd lyricwave-backend
npm init -y

# Core dependencies
npm install express cors helmet morgan dotenv
npm install @prisma/client jsonwebtoken bcryptjs
npm install multer uuid bull ioredis
npm install express-rate-limit express-validator

# TypeScript & types
npm install -D typescript ts-node ts-node-dev @types/express
npm install -D @types/node @types/cors @types/multer
npm install -D @types/jsonwebtoken @types/bcryptjs @types/uuid

# Prisma
npm install -D prisma
npx prisma init`} />
              </section>

              {/* ════════════════════════════════════════
                  3. STRUCTURE DU PROJET
              ════════════════════════════════════════ */}
              <section id="structure">
                <SectionTitle icon={GitBranch} title="Structure du projet backend" />
                <CodeBlock lang="plaintext" code={`lyricwave-backend/
├── src/
│   ├── app.ts                  # Entrée Express (middlewares, routes)
│   ├── server.ts               # Démarrage du serveur HTTP
│   │
│   ├── config/
│   │   ├── env.ts              # Validation des variables d'environnement
│   │   ├── prisma.ts           # Instance Prisma singleton
│   │   └── storage.ts          # Config Supabase / S3
│   │
│   ├── routes/
│   │   ├── auth.routes.ts      # /api/auth/*
│   │   ├── projects.routes.ts  # /api/projects/*
│   │   ├── lyrics.routes.ts    # /api/lyrics/*
│   │   ├── upload.routes.ts    # /api/upload/*
│   │   ├── feed.routes.ts      # /api/feed/*
│   │   ├── templates.routes.ts # /api/templates/*
│   │   └── subscription.routes.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── projects.controller.ts
│   │   ├── lyrics.controller.ts
│   │   ├── upload.controller.ts
│   │   └── feed.controller.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts   # Vérification JWT
│   │   ├── upload.middleware.ts # Config Multer
│   │   ├── rateLimit.ts        # Limiteur de requêtes
│   │   └── validate.ts         # Validation des inputs
│   │
│   ├── services/
│   │   ├── auth.service.ts      # Logique JWT / bcrypt
│   │   ├── storage.service.ts   # Upload vers S3/Supabase
│   │   └── sync.service.ts      # Auto-sync algorithm
│   │
│   └── types/
│       └── index.ts             # Interfaces TypeScript
│
├── prisma/
│   └── schema.prisma            # Schéma base de données
│
├── .env                         # Variables locales (ne pas committer)
├── .env.example                 # Template de variables
├── tsconfig.json
└── package.json`} />
              </section>

              {/* ════════════════════════════════════════
                  4. VARIABLES D'ENVIRONNEMENT
              ════════════════════════════════════════ */}
              <section id="env">
                <SectionTitle icon={Key} title="Variables d'environnement" color="text-accent" />

                <div className="glass rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 mb-5 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-yellow-400">Important :</strong> Ne jamais committer le fichier <code className="font-mono text-xs">.env</code> dans Git.
                    Utiliser <code className="font-mono text-xs">.env.example</code> comme template.
                  </p>
                </div>

                <h3 className="font-heading text-base font-bold mb-2">Backend — <code className="font-mono text-sm text-accent">.env</code></h3>
                <CodeBlock lang="dotenv" code={`# ── Serveur ─────────────────────────────────────
NODE_ENV=development
PORT=3001

# ── Base de données PostgreSQL ───────────────────
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/lyricwave_db"

# ── JWT ─────────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars
JWT_REFRESH_EXPIRES_IN=7d

# ── Supabase Storage (pour les fichiers) ─────────
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET_AUDIO=lyricwave-audio
SUPABASE_BUCKET_COVERS=lyricwave-covers
SUPABASE_BUCKET_VIDEOS=lyricwave-videos

# ── Redis (Bull queue) ───────────────────────────
REDIS_URL=redis://localhost:6379

# ── CORS ─────────────────────────────────────────
FRONTEND_URL=http://localhost:5173

# ── Stripe (paiements) ───────────────────────────
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx`} />

                <h3 className="font-heading text-base font-bold mb-2 mt-6">Frontend — <code className="font-mono text-sm text-accent">.env.local</code></h3>
                <CodeBlock lang="dotenv" code={`# URL de base de l'API backend
VITE_API_URL=http://localhost:3001/api

# En production :
# VITE_API_URL=https://api.lyricwave.com/api`} />
              </section>

              {/* ════════════════════════════════════════
                  5. BASE DE DONNÉES
              ════════════════════════════════════════ */}
              <section id="database">
                <SectionTitle icon={Database} title="Schéma de base de données (Prisma)" />
                <CodeBlock lang="prisma" code={`// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole { FREE PRO ENTERPRISE ADMIN }
enum ProjectStatus { DRAFT PROCESSING COMPLETED FAILED }
enum VideoFormat { TIKTOK YOUTUBE YOUTUBE_FULL INSTAGRAM SHORTS }
enum SyncMethod { AUTO MANUAL }

model User {
  id                   String    @id @default(cuid())
  email                String    @unique
  password             String
  name                 String?
  avatar               String?
  role                 UserRole  @default(FREE)
  creditsRemaining     Int       @default(3)
  subscriptionEndsAt   DateTime?
  projects             Project[]
  feedPosts            FeedPost[]
  refreshTokens        RefreshToken[]
  likes                Like[]
  follows              Follow[]  @relation("Follower")
  followers            Follow[]  @relation("Following")
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  @@index([email])
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
  @@index([userId])
}

model Project {
  id            String        @id @default(cuid())
  userId        String
  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  title         String
  artist        String?
  status        ProjectStatus @default(DRAFT)
  audioUrl      String
  coverUrl      String
  videoUrl      String?
  audioDuration Float?
  syncMethod    SyncMethod    @default(AUTO)
  format        VideoFormat   @default(TIKTOK)
  lyrics        Lyric[]
  feedPost      FeedPost?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  @@index([userId])
}

model Lyric {
  id          String   @id @default(cuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  text        String
  startTime   Float
  endTime     Float
  orderIndex  Int
  wordTimings Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@index([projectId])
}

model FeedPost {
  id          String   @id @default(cuid())
  projectId   String   @unique
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  videoUrl    String
  caption     String?
  views       Int      @default(0)
  likes       Like[]
  comments    Comment[]
  isPublic    Boolean  @default(true)
  createdAt   DateTime @default(now())
  @@index([userId])
}

model Like {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  postId     String
  post       FeedPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  @@unique([userId, postId])
}

model Comment {
  id        String   @id @default(cuid())
  text      String
  postId    String
  post      FeedPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  createdAt DateTime @default(now())
}

model Follow {
  id          String @id @default(cuid())
  followerId  String
  follower    User   @relation("Follower", fields: [followerId], references: [id])
  followingId String
  following   User   @relation("Following", fields: [followingId], references: [id])
  createdAt   DateTime @default(now())
  @@unique([followerId, followingId])
}

model Template {
  id          String   @id @default(cuid())
  name        String
  description String?
  settings    Json
  thumbnail   String?
  isPremium   Boolean  @default(false)
  category    String?
  createdAt   DateTime @default(now())
}`} />

                <h3 className="font-heading text-base font-bold mb-2">Commandes Prisma</h3>
                <CodeBlock lang="bash" code={`# Générer le client Prisma après modification du schéma
npx prisma generate

# Appliquer les migrations en développement
npx prisma migrate dev --name init

# Appliquer en production
npx prisma migrate deploy

# Ouvrir Prisma Studio (interface graphique DB)
npx prisma studio

# Seed initial (templates, etc.)
npx prisma db seed`} />
              </section>

              {/* ════════════════════════════════════════
                  6. AUTHENTIFICATION
              ════════════════════════════════════════ */}
              <section id="auth">
                <SectionTitle icon={Lock} title="Authentification JWT" color="text-secondary" />
                <p className="text-sm text-muted-foreground mb-5">
                  Le frontend gère les tokens via <code className="font-mono text-xs text-accent bg-muted/50 px-1.5 py-0.5 rounded">localStorage</code> (access token 15min + refresh token 7j).
                  Le middleware backend vérifie le header <code className="font-mono text-xs text-accent bg-muted/50 px-1.5 py-0.5 rounded">Authorization: Bearer &lt;token&gt;</code>.
                </p>

                <h3 className="font-heading text-base font-bold mb-2">Middleware d'authentification</h3>
                <CodeBlock lang="typescript" code={`// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};`} />

                <h3 className="font-heading text-base font-bold mb-2 mt-6">Format de réponse attendu par le frontend</h3>
                <CodeBlock lang="json" code={`// POST /api/auth/login — Réponse attendue par le frontend
{
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "Giovanni Huram",
    "avatar": "https://storage.../avatar.jpg",
    "role": "PRO",
    "creditsRemaining": 50
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`} />
              </section>

              {/* ════════════════════════════════════════
                  7. ENDPOINTS API
              ════════════════════════════════════════ */}
              <section id="endpoints">
                <SectionTitle icon={Globe} title="Référence des endpoints API" />

                {/* AUTH */}
                <div className="glass rounded-2xl border border-border/40 p-5 mb-5">
                  <h3 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Authentification — <code className="font-mono text-sm text-muted-foreground">/api/auth</code>
                  </h3>
                  <Endpoint method="POST" path="/api/auth/signup" desc="Inscription avec email + mot de passe" />
                  <Endpoint method="POST" path="/api/auth/login" desc="Connexion — retourne accessToken + refreshToken" />
                  <Endpoint method="POST" path="/api/auth/refresh" desc="Renouveler l'access token avec le refresh token" />
                  <Endpoint method="POST" path="/api/auth/logout" desc="Invalider le refresh token" auth />
                  <Endpoint method="GET" path="/api/auth/me" desc="Profil de l'utilisateur connecté" auth />
                  <Endpoint method="PUT" path="/api/auth/profile" desc="Mettre à jour le profil (nom, avatar)" auth />
                </div>

                {/* PROJECTS */}
                <div className="glass rounded-2xl border border-border/40 p-5 mb-5">
                  <h3 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
                    <Film className="w-4 h-4 text-secondary" /> Projets — <code className="font-mono text-sm text-muted-foreground">/api/projects</code>
                  </h3>
                  <Endpoint method="GET" path="/api/projects" desc="Liste les projets de l'utilisateur connecté" auth />
                  <Endpoint method="POST" path="/api/projects" desc="Créer un nouveau projet (titre, artiste, format)" auth />
                  <Endpoint method="GET" path="/api/projects/:id" desc="Détails d'un projet avec ses lyrics et timings" auth />
                  <Endpoint method="PUT" path="/api/projects/:id" desc="Mettre à jour les métadonnées d'un projet" auth />
                  <Endpoint method="DELETE" path="/api/projects/:id" desc="Supprimer un projet et ses fichiers associés" auth />
                  <Endpoint method="POST" path="/api/projects/:id/duplicate" desc="Dupliquer un projet complet avec ses lyrics" auth />
                  <Endpoint method="POST" path="/api/projects/:id/generate" desc="Lancer la génération vidéo côté serveur (job async)" auth />
                  <Endpoint method="GET" path="/api/projects/:id/status" desc="Vérifier le statut de génération (SSE ou polling)" auth />
                  <Endpoint method="GET" path="/api/projects/:id/download" desc="URL signée de téléchargement de la vidéo générée" auth />
                </div>

                {/* LYRICS */}
                <div className="glass rounded-2xl border border-border/40 p-5 mb-5">
                  <h3 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
                    <Music2 className="w-4 h-4 text-accent" /> Paroles — <code className="font-mono text-sm text-muted-foreground">/api/lyrics</code>
                  </h3>
                  <Endpoint method="GET" path="/api/projects/:id/lyrics" desc="Récupérer toutes les lignes de paroles avec timings" auth />
                  <Endpoint method="POST" path="/api/projects/:id/lyrics" desc="Sauvegarder les paroles (tableau de lignes)" auth />
                  <Endpoint method="PUT" path="/api/lyrics/:id" desc="Modifier le texte ou les timings d'une ligne" auth />
                  <Endpoint method="DELETE" path="/api/lyrics/:id" desc="Supprimer une ligne de paroles" auth />
                  <Endpoint method="POST" path="/api/projects/:id/lyrics/auto-sync" desc="Lancer l'algorithme d'auto-synchronisation" auth />
                  <Endpoint method="POST" path="/api/projects/:id/lyrics/bulk" desc="Sauvegarder toutes les lignes en une requête (recommandé)" auth />
                </div>

                {/* UPLOAD */}
                <div className="glass rounded-2xl border border-border/40 p-5 mb-5">
                  <h3 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-primary" /> Upload — <code className="font-mono text-sm text-muted-foreground">/api/upload</code>
                  </h3>
                  <Endpoint method="POST" path="/api/upload/audio" desc="Upload audio (MP3/WAV/M4A, max 50MB) — retourne URL publique" auth />
                  <Endpoint method="POST" path="/api/upload/cover" desc="Upload cover art (JPG/PNG/WebP, max 10MB) — retourne URL publique" auth />
                  <Endpoint method="DELETE" path="/api/upload/:fileKey" desc="Supprimer un fichier du storage" auth />
                </div>

                {/* FEED */}
                <div className="glass rounded-2xl border border-border/40 p-5 mb-5">
                  <h3 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" /> Fil d'actualité — <code className="font-mono text-sm text-muted-foreground">/api/feed</code>
                  </h3>
                  <Endpoint method="GET" path="/api/feed" desc="Fil public paginé (cursor-based pagination)" />
                  <Endpoint method="GET" path="/api/feed/following" desc="Fil des comptes suivis par l'utilisateur" auth />
                  <Endpoint method="POST" path="/api/feed/publish" desc="Publier un projet sur le fil d'actualité" auth />
                  <Endpoint method="POST" path="/api/feed/:postId/like" desc="Liker / unliker une vidéo" auth />
                  <Endpoint method="POST" path="/api/feed/:postId/comment" desc="Ajouter un commentaire" auth />
                  <Endpoint method="GET" path="/api/feed/:postId/comments" desc="Récupérer les commentaires paginés" />
                  <Endpoint method="POST" path="/api/users/:id/follow" desc="Suivre / ne plus suivre un utilisateur" auth />
                </div>

                {/* TEMPLATES */}
                <div className="glass rounded-2xl border border-border/40 p-5 mb-5">
                  <h3 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-secondary" /> Templates — <code className="font-mono text-sm text-muted-foreground">/api/templates</code>
                  </h3>
                  <Endpoint method="GET" path="/api/templates" desc="Lister tous les templates (gratuits + premium)" />
                  <Endpoint method="GET" path="/api/templates/:id" desc="Détails d'un template avec ses settings JSON" />
                  <Endpoint method="POST" path="/api/templates" desc="Créer un template personnalisé (Pro+)" auth />
                </div>

                {/* SUBSCRIPTION */}
                <div className="glass rounded-2xl border border-border/40 p-5">
                  <h3 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-400" /> Abonnements — <code className="font-mono text-sm text-muted-foreground">/api/subscription</code>
                  </h3>
                  <Endpoint method="GET" path="/api/subscription/plans" desc="Liste des plans tarifaires (Free, Pro $9.99, Enterprise $49.99)" />
                  <Endpoint method="POST" path="/api/subscription/checkout" desc="Créer une session Stripe Checkout" auth />
                  <Endpoint method="POST" path="/api/subscription/webhook" desc="Webhook Stripe (ne pas protéger par JWT)" />
                  <Endpoint method="GET" path="/api/subscription/status" desc="Statut d'abonnement de l'utilisateur connecté" auth />
                </div>
              </section>

              {/* ════════════════════════════════════════
                  8. UPLOAD
              ════════════════════════════════════════ */}
              <section id="upload">
                <SectionTitle icon={Upload} title="Gestion des uploads de fichiers" />
                <p className="text-sm text-muted-foreground mb-5">
                  Le frontend envoie les fichiers via <code className="font-mono text-xs text-accent bg-muted/50 px-1.5 py-0.5 rounded">multipart/form-data</code>.
                  Le backend valide, stocke sur Supabase Storage, et retourne l'URL publique.
                </p>
                <CodeBlock lang="typescript" code={`// src/middleware/upload.middleware.ts
import multer from 'multer';

// Stockage en mémoire (puis push vers Supabase/S3)
const storage = multer.memoryStorage();

export const audioUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (_, file, cb) => {
    const allowed = ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/mp4'];
    cb(null, allowed.includes(file.mimetype));
  },
});

export const coverUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

// src/controllers/upload.controller.ts
export const uploadAudio = async (req, res) => {
  const { buffer, mimetype, originalname } = req.file;
  const key = \`audio/\${req.userId}/\${uuid()}-\${originalname}\`;
  
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_AUDIO)
    .upload(key, buffer, { contentType: mimetype });

  if (error) return res.status(500).json({ error: error.message });

  const { data: { publicUrl } } = supabase.storage
    .from(process.env.SUPABASE_BUCKET_AUDIO)
    .getPublicUrl(key);

  // Retourner l'URL — le frontend l'enregistre dans son state
  res.json({ url: publicUrl, key });
};`} />

                <h3 className="font-heading text-base font-bold mb-2 mt-6">Format de réponse upload attendu</h3>
                <CodeBlock lang="json" code={`// POST /api/upload/audio — Réponse attendue
{
  "url": "https://xxxx.supabase.co/storage/v1/object/public/lyricwave-audio/audio/user_id/filename.mp3",
  "key": "audio/user_id/uuid-filename.mp3",
  "duration": 213.4   // secondes — extraire avec ffprobe ou music-metadata
}

// POST /api/upload/cover — Réponse attendue
{
  "url": "https://xxxx.supabase.co/storage/v1/object/public/lyricwave-covers/...",
  "key": "covers/user_id/uuid-cover.jpg",
  "width": 1000,
  "height": 1000
}`} />
              </section>

              {/* ════════════════════════════════════════
                  9. GÉNÉRATION VIDÉO
              ════════════════════════════════════════ */}
              <section id="video">
                <SectionTitle icon={Film} title="Génération vidéo — Architecture hybride" color="text-accent" />
                <div className="glass rounded-xl border border-border/40 p-4 mb-5 bg-primary/5 border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-primary">Note architecturale :</strong> La génération est faite
                    <strong className="text-foreground"> côté client </strong>
                    (Canvas API + MediaRecorder) dans le composant <code className="font-mono text-xs text-accent">VideoGenerator.tsx</code>.
                    Le backend peut optionnellement offrir une génération serveur via FFmpeg pour les utilisateurs Pro.
                  </p>
                </div>

                <CodeBlock lang="typescript" code={`// src/services/video.service.ts
// Génération côté serveur avec fluent-ffmpeg (optionnel - users Pro)
import ffmpeg from 'fluent-ffmpeg';

export const generateVideoServer = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { lyrics: { orderBy: { orderIndex: 'asc' } } }
  });

  // Générer le fichier de sous-titres ASS/SRT
  const subtitles = generateSubtitleFile(project.lyrics);
  
  // Assembler la vidéo avec FFmpeg
  await new Promise((resolve, reject) => {
    ffmpeg(project.audioUrl)
      .input(project.coverUrl)
      .complexFilter([
        '[1:v]scale=1080:1920,setsar=1[bg]',
        \`[bg]subtitles=\${subtitles}[out]\`
      ])
      .outputOptions(['-map [out]', '-map 0:a', '-c:v libx264', '-c:a aac'])
      .output(\`/tmp/\${projectId}.mp4\`)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });

  // Upload vers Supabase
  const videoUrl = await uploadToStorage(\`/tmp/\${projectId}.mp4\`, 'videos');
  
  // Mettre à jour le projet
  await prisma.project.update({
    where: { id: projectId },
    data: { videoUrl, status: 'COMPLETED' }
  });
  
  return videoUrl;
};`} />
              </section>

              {/* ════════════════════════════════════════
                  10. CORS & SÉCURITÉ
              ════════════════════════════════════════ */}
              <section id="cors">
                <SectionTitle icon={Shield} title="CORS & Configuration de sécurité" color="text-red-400" />
                <CodeBlock lang="typescript" code={`// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// ── Sécurité HTTP headers ─────────────────────
app.use(helmet());

// ── CORS : autoriser le frontend ──────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    // Ajouter le domaine de production ici :
    'https://lyricwave.lovable.app',
    'https://www.lyricwave.com',
  ],
  credentials: true,             // Cookies si utilisés
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parsers ──────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting global ──────────────────────
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

// ── Rate limit strict sur la génération vidéo ─
app.use('/api/projects/:id/generate', rateLimit({
  windowMs: 60_000,
  max: 3,
  message: { error: 'Trop de générations. Réessayez dans 1 minute.' }
}));

// ── Routes ───────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/lyrics', lyricsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/subscription', subscriptionRoutes);

export default app;`} />
              </section>

              {/* ════════════════════════════════════════
                  11. CONNECTER AU FRONTEND
              ════════════════════════════════════════ */}
              <section id="connect">
                <SectionTitle icon={Wifi} title="Connecter le backend au frontend" />

                <div className="space-y-5">
                  <p className="text-sm text-muted-foreground">
                    Le frontend utilise un <strong className="text-foreground">client API centralisé</strong>. Créer ce fichier dans le projet React :
                  </p>

                  <CodeBlock lang="typescript" code={`// src/lib/api.ts — À créer dans le frontend LyricWave

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ── Helper avec gestion automatique du token ──
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('lyricwave_access_token');
  
  const res = await fetch(\`\${BASE_URL}\${endpoint}\`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
      ...options.headers,
    },
  });

  // Auto-refresh si 401
  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return fetchAPI(endpoint, options); // Retry
    }
    localStorage.clear();
    window.location.href = '/auth';
  }

  if (!res.ok) throw await res.json();
  return res.json();
};

// ── Auth ─────────────────────────────────────
export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    
    signup: (name: string, email: string, password: string) =>
      fetchAPI('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
    
    me: () => fetchAPI('/auth/me'),
    logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
  },

  projects: {
    list: () => fetchAPI('/projects'),
    create: (data: object) => fetchAPI('/projects', { method: 'POST', body: JSON.stringify(data) }),
    get: (id: string) => fetchAPI(\`/projects/\${id}\`),
    update: (id: string, data: object) => fetchAPI(\`/projects/\${id}\`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(\`/projects/\${id}\`, { method: 'DELETE' }),
    duplicate: (id: string) => fetchAPI(\`/projects/\${id}/duplicate\`, { method: 'POST' }),
  },

  upload: {
    audio: (file: File) => {
      const form = new FormData();
      form.append('audio', file);
      const token = localStorage.getItem('lyricwave_access_token');
      return fetch(\`\${BASE_URL}/upload/audio\`, {
        method: 'POST',
        headers: { Authorization: \`Bearer \${token}\` },
        body: form,
      }).then(r => r.json());
    },
    cover: (file: File) => {
      const form = new FormData();
      form.append('cover', file);
      const token = localStorage.getItem('lyricwave_access_token');
      return fetch(\`\${BASE_URL}/upload/cover\`, {
        method: 'POST',
        headers: { Authorization: \`Bearer \${token}\` },
        body: form,
      }).then(r => r.json());
    },
  },

  lyrics: {
    get: (projectId: string) => fetchAPI(\`/projects/\${projectId}/lyrics\`),
    bulk: (projectId: string, lyrics: object[]) =>
      fetchAPI(\`/projects/\${projectId}/lyrics/bulk\`, { method: 'POST', body: JSON.stringify({ lyrics }) }),
    autoSync: (projectId: string) =>
      fetchAPI(\`/projects/\${projectId}/lyrics/auto-sync\`, { method: 'POST' }),
  },

  feed: {
    get: (cursor?: string) => fetchAPI(\`/feed\${cursor ? \`?cursor=\${cursor}\` : ''}\`),
    publish: (projectId: string, caption: string) =>
      fetchAPI('/feed/publish', { method: 'POST', body: JSON.stringify({ projectId, caption }) }),
    like: (postId: string) => fetchAPI(\`/feed/\${postId}/like\`, { method: 'POST' }),
  },
};`} />

                  <h3 className="font-heading text-base font-bold mt-6 mb-3">Checklist de connexion</h3>
                  <div className="glass rounded-xl border border-border/40 p-4 space-y-3">
                    {[
                      { step: "1", text: "Démarrer le backend : npm run dev → port 3001" },
                      { step: "2", text: "Créer .env.local dans le frontend avec VITE_API_URL=http://localhost:3001/api" },
                      { step: "3", text: "Vérifier la config CORS : ajouter http://localhost:5173 dans FRONTEND_URL" },
                      { step: "4", text: "Tester : GET http://localhost:3001/api/health → { status: 'ok' }" },
                      { step: "5", text: "Tester l'inscription via /auth → vérifier le retour accessToken + refreshToken" },
                      { step: "6", text: "Vérifier les uploads : POST /api/upload/audio avec un fichier test" },
                      { step: "7", text: "Tester le fil d'actualité : GET /api/feed → tableau de posts" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {item.step}
                        </span>
                        <p className="text-sm text-muted-foreground">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ════════════════════════════════════════
                  12. DÉPLOIEMENT
              ════════════════════════════════════════ */}
              <section id="deploy">
                <SectionTitle icon={Cloud} title="Déploiement en production" color="text-secondary" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { name: "Railway", desc: "Recommandé", note: "Deploy depuis GitHub. PostgreSQL + Redis inclus.", color: "border-primary/30 bg-primary/5" },
                    { name: "Render", desc: "Alternative", note: "Free tier disponible. PostgreSQL intégré.", color: "border-secondary/30 bg-secondary/5" },
                    { name: "Fly.io", desc: "Avancé", note: "Contrôle total. Multi-région. Docker.", color: "border-accent/30 bg-accent/5" },
                  ].map((p) => (
                    <div key={p.name} className={`glass rounded-xl border p-4 ${p.color}`}>
                      <div className="font-heading font-bold text-base">{p.name}</div>
                      <div className="text-xs text-primary mb-2">{p.desc}</div>
                      <p className="text-xs text-muted-foreground">{p.note}</p>
                    </div>
                  ))}
                </div>

                <CodeBlock lang="bash" code={`# Dockerfile du backend
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Prisma
RUN npx prisma generate
EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]`} />

                <h3 className="font-heading text-base font-bold mb-2 mt-6">Variables d'env en production</h3>
                <CodeBlock lang="bash" code={`# À configurer dans Railway / Render / Fly.io
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=<64_char_random_string>
JWT_REFRESH_SECRET=<64_char_random_string>
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=service_role_key
FRONTEND_URL=https://lyricwave.lovable.app
REDIS_URL=redis://...
STRIPE_SECRET_KEY=sk_live_...`} />

                <h3 className="font-heading text-base font-bold mb-2 mt-6">Mise à jour de VITE_API_URL en production</h3>
                <CodeBlock lang="dotenv" code={`# Dans Lovable : ajouter dans les secrets du projet
VITE_API_URL=https://api.lyricwave.com/api
# ou l'URL Railway/Render de votre backend`} />

                {/* Final note */}
                <div className="glass rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6 mt-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base mb-2">Questions & Support développeur</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Pour toute question technique sur l'intégration, contacter le mainteneur du projet via la page support ou ouvrir une issue GitHub.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <a href="/support" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                          <ExternalLink className="w-3.5 h-3.5" /> Page Support
                        </a>
                        <a href="mailto:dev@lyricwave.com" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                          <ExternalLink className="w-3.5 h-3.5" /> dev@lyricwave.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Signature */}
              <div className="border-t border-border/30 pt-8 text-center">
                <p className="text-xs text-muted-foreground font-mono">
                  Documentation LyricWave v1.0 · Créé par{" "}
                  <span className="text-primary font-semibold">Giovanni Huram</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>

            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendDocs;
