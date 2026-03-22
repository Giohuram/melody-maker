import db from "../config/database.js";

export type ProjectStatus = "draft" | "processing" | "completed" | "failed";
export type VideoFormat = "tiktok" | "youtube" | "youtube-full" | "instagram" | "shorts";

export interface Project {
  id: string;
  userId: string;
  title: string;
  artist: string;
  status: ProjectStatus;
  format: VideoFormat;
  createdAt: string;
  updatedAt: string;
  duration: string;
  lyrics: string[];
  audioUrl: string | null;
  coverUrl: string | null;
  style: {
    template: string;
    fontStyle: string;
    textPosition: string;
    transition: string;
    showProgress: boolean;
    karaoke: boolean;
  };
}

interface ProjectRow {
  id: string;
  user_id: string;
  title: string;
  artist: string;
  status: string;
  format: string;
  created_at: string;
  updated_at: string;
  duration: string;
  lyrics: string;
  audio_url: string | null;
  cover_url: string | null;
  style: string;
}

const rowToProject = (row: ProjectRow): Project => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  artist: row.artist,
  status: row.status as ProjectStatus,
  format: row.format as VideoFormat,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  duration: row.duration,
  lyrics: JSON.parse(row.lyrics),
  audioUrl: row.audio_url,
  coverUrl: row.cover_url,
  style: JSON.parse(row.style),
});

export const findProjectsByUser = (userId: string): Project[] => {
  const rows = db.prepare("SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC").all(userId) as ProjectRow[];
  return rows.map(rowToProject);
};

export const findProjectById = (id: string): Project | undefined => {
  const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as ProjectRow | undefined;
  return row ? rowToProject(row) : undefined;
};

export const insertProject = (p: {
  id: string; userId: string; title: string; artist: string; format: string;
  duration: string; lyrics: string[]; style: any;
}): Project => {
  db.prepare(
    `INSERT INTO projects (id, user_id, title, artist, status, format, duration, lyrics, style)
     VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?)`
  ).run(p.id, p.userId, p.title, p.artist, p.format, p.duration, JSON.stringify(p.lyrics), JSON.stringify(p.style));
  return findProjectById(p.id)!;
};

export const updateProjectById = (id: string, userId: string, data: Partial<Record<string, any>>): Project | undefined => {
  const existing = db.prepare("SELECT * FROM projects WHERE id = ? AND user_id = ?").get(id, userId) as ProjectRow | undefined;
  if (!existing) return undefined;

  const updates: string[] = [];
  const values: any[] = [];

  const fieldMap: Record<string, string> = {
    title: "title", artist: "artist", status: "status", format: "format",
    duration: "duration", audioUrl: "audio_url", coverUrl: "cover_url",
  };

  for (const [key, col] of Object.entries(fieldMap)) {
    if (data[key] !== undefined) {
      updates.push(`${col} = ?`);
      values.push(data[key]);
    }
  }
  if (data.lyrics !== undefined) {
    updates.push("lyrics = ?");
    values.push(JSON.stringify(data.lyrics));
  }
  if (data.style !== undefined) {
    updates.push("style = ?");
    values.push(JSON.stringify(data.style));
  }

  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    values.push(id, userId);
    db.prepare(`UPDATE projects SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`).run(...values);
  }

  return findProjectById(id);
};

export const deleteProjectById = (id: string, userId: string): boolean => {
  const result = db.prepare("DELETE FROM projects WHERE id = ? AND user_id = ?").run(id, userId);
  return result.changes > 0;
};
