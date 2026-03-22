import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../../data/melody-maker.db");

// Ensure data directory exists
import fs from "fs";
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db: InstanceType<typeof Database> = new Database(DB_PATH);

// Enable WAL mode for better concurrent performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ─── Schema ──────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar TEXT NOT NULL DEFAULT '',
    verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    format TEXT NOT NULL DEFAULT 'tiktok',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    duration TEXT NOT NULL DEFAULT '0:00',
    lyrics TEXT NOT NULL DEFAULT '[]',
    audio_url TEXT,
    cover_url TEXT,
    style TEXT NOT NULL DEFAULT '{}',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS feed_posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    project_id TEXT,
    song TEXT NOT NULL,
    artist TEXT NOT NULL,
    format TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    shares INTEGER NOT NULL DEFAULT 0,
    views INTEGER NOT NULL DEFAULT 0,
    caption TEXT NOT NULL DEFAULT '',
    tags TEXT NOT NULL DEFAULT '[]',
    gradient TEXT NOT NULL DEFAULT '',
    lyrics_preview TEXT NOT NULL DEFAULT '[]',
    duration TEXT NOT NULL DEFAULT '0:00',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (post_id) REFERENCES feed_posts(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS likes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (post_id) REFERENCES feed_posts(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (post_id) REFERENCES feed_posts(id) ON DELETE CASCADE
  );
`);

// ─── Seed data (only if tables are empty) ────────────
const userCount = (db.prepare("SELECT COUNT(*) as count FROM users").get() as any).count;

if (userCount === 0) {
  console.log("🌱 Seeding database with test data...");

  const seedPassword = bcrypt.hashSync("password123", 10);

  const seedUsers = [
    { id: "seed-1", name: "DJ Nova", email: "djnova@test.com", avatar: "N", verified: 1 },
    { id: "seed-2", name: "Luna Beats", email: "luna@test.com", avatar: "L", verified: 0 },
    { id: "seed-3", name: "Afro Kings", email: "afro@test.com", avatar: "A", verified: 1 },
    { id: "seed-4", name: "Yume", email: "yume@test.com", avatar: "Y", verified: 0 },
    { id: "seed-5", name: "Test User", email: "test@test.com", avatar: "T", verified: 0 },
  ];

  const insertUser = db.prepare(
    "INSERT INTO users (id, name, email, password_hash, avatar, verified) VALUES (?, ?, ?, ?, ?, ?)"
  );
  for (const u of seedUsers) {
    insertUser.run(u.id, u.name, u.email, seedPassword, u.avatar, u.verified);
  }

  // Seed projects for test user
  const insertProject = db.prepare(
    `INSERT INTO projects (id, user_id, title, artist, status, format, duration, lyrics, style)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const defaultStyle = JSON.stringify({
    template: "neon", fontStyle: "montserrat", textPosition: "center",
    transition: "fade", showProgress: true, karaoke: false,
  });

  const seedProjects = [
    { id: "p1", userId: "seed-5", title: "Summer Vibes", artist: "DJ Nova", status: "completed", format: "tiktok", duration: "3:42" },
    { id: "p2", userId: "seed-5", title: "Midnight Drive", artist: "Luna Beats", status: "processing", format: "youtube-full", duration: "4:15" },
    { id: "p3", userId: "seed-5", title: "Neon Lights", artist: "CityWave", status: "draft", format: "instagram", duration: "2:58" },
    { id: "p4", userId: "seed-5", title: "Lost in Tokyo", artist: "Yume", status: "completed", format: "shorts", duration: "0:45" },
    { id: "p5", userId: "seed-5", title: "Afrobeats Vol.3", artist: "Afro Kings", status: "failed", format: "tiktok", duration: "3:20" },
    { id: "p6", userId: "seed-5", title: "Electric Dreams", artist: "Synthwave J", status: "completed", format: "youtube", duration: "5:10" },
  ];

  for (const p of seedProjects) {
    insertProject.run(p.id, p.userId, p.title, p.artist, p.status, p.format, p.duration, "[]", defaultStyle);
  }

  // Seed feed posts
  const insertPost = db.prepare(
    `INSERT INTO feed_posts (id, user_id, project_id, song, artist, format, likes, shares, views, caption, tags, gradient, lyrics_preview, duration)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const seedPosts = [
    {
      id: "fp1", userId: "seed-1", projectId: "seed-p1", song: "Summer Vibes", artist: "DJ Nova",
      format: "TikTok", likes: 12400, shares: 1200, views: 248000,
      caption: "Mon nouveau son d'été est là 🌊🔥 Partagez si vous kiffez !",
      tags: ["#SummerVibes", "#NewMusic", "#HipHop"],
      gradient: "from-primary/80 via-secondary/60 to-background",
      lyricsPreview: ["☀️ The sun is calling", "Feel the summer in your soul", "We're dancing till the morning glow"],
      duration: "3:42",
    },
    {
      id: "fp2", userId: "seed-2", projectId: "seed-p2", song: "Midnight Drive", artist: "Luna Beats",
      format: "YouTube", likes: 8700, shares: 780, views: 112000,
      caption: "Pour tous ceux qui roulent la nuit 🌙🚗 Vibe nocturne absolue.",
      tags: ["#MidnightVibes", "#LoFi", "#NightDrive"],
      gradient: "from-secondary/80 via-accent/30 to-background",
      lyricsPreview: ["🌙 City lights blur past", "Racing through the dark abyss", "Nothing but the beat and road"],
      duration: "4:15",
    },
    {
      id: "fp3", userId: "seed-3", projectId: "seed-p3", song: "Afrobeats Vol.3", artist: "Afro Kings",
      format: "Instagram", likes: 24300, shares: 3400, views: 1200000,
      caption: "Vol.3 est enfin là ! Le son qui va faire bouger toute l'Afrique 🌍🥁",
      tags: ["#Afrobeats", "#AfroKings", "#Viral"],
      gradient: "from-accent/80 via-primary/40 to-background",
      lyricsPreview: ["🥁 Shakete shakete", "Feel the rhythm in your chest", "Africa rising, we manifest"],
      duration: "3:20",
    },
    {
      id: "fp4", userId: "seed-4", projectId: "seed-p4", song: "Lost in Tokyo", artist: "Yume",
      format: "Shorts", likes: 6200, shares: 450, views: 89000,
      caption: "Tokyo by night, une vibe unique 🗼✨ Créé avec LyricWave !",
      tags: ["#Tokyo", "#CityPop", "#Japan"],
      gradient: "from-secondary/60 via-primary/40 to-background",
      lyricsPreview: ["🗼 Neon signs reflect", "Lost in Tokyo's embrace", "Every street a new dream chased"],
      duration: "0:45",
    },
  ];

  for (const p of seedPosts) {
    insertPost.run(
      p.id, p.userId, p.projectId, p.song, p.artist, p.format,
      p.likes, p.shares, p.views, p.caption,
      JSON.stringify(p.tags), p.gradient, JSON.stringify(p.lyricsPreview), p.duration
    );
  }

  // Seed comments
  const insertComment = db.prepare(
    "INSERT INTO comments (id, post_id, user_id, user_name, text) VALUES (?, ?, ?, ?, ?)"
  );
  insertComment.run(uuidv4(), "fp1", "seed-2", "Marie L.", "Incroyable ce son ! 🔥");
  insertComment.run(uuidv4(), "fp1", "seed-3", "Kofi B.", "LyricWave c'est la meilleure plateforme !");
  insertComment.run(uuidv4(), "fp2", "seed-1", "Sophie T.", "J'adore le mode karaoké 🎤");

  console.log("✅ Database seeded successfully!");
}

export default db;
