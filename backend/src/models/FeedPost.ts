import db from "../config/database.js";

export interface FeedPost {
  id: string;
  userId: string;
  projectId: string;
  song: string;
  artist: string;
  format: string;
  likes: number;
  comments: Comment[];
  shares: number;
  views: number;
  caption: string;
  tags: string[];
  gradient: string;
  lyricsPreview: string[];
  duration: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

interface PostRow {
  id: string;
  user_id: string;
  project_id: string;
  song: string;
  artist: string;
  format: string;
  likes: number;
  shares: number;
  views: number;
  caption: string;
  tags: string;
  gradient: string;
  lyrics_preview: string;
  duration: string;
  created_at: string;
}

interface CommentRow {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
}

const getCommentsForPost = (postId: string): Comment[] => {
  const rows = db.prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC").all(postId) as CommentRow[];
  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    userName: r.user_name,
    text: r.text,
    createdAt: r.created_at,
  }));
};

const rowToFeedPost = (row: PostRow): FeedPost => ({
  id: row.id,
  userId: row.user_id,
  projectId: row.project_id,
  song: row.song,
  artist: row.artist,
  format: row.format,
  likes: row.likes,
  comments: getCommentsForPost(row.id),
  shares: row.shares,
  views: row.views,
  caption: row.caption,
  tags: JSON.parse(row.tags),
  gradient: row.gradient,
  lyricsPreview: JSON.parse(row.lyrics_preview),
  duration: row.duration,
  createdAt: row.created_at,
});

export const getAllFeedPosts = (): FeedPost[] => {
  const rows = db.prepare("SELECT * FROM feed_posts ORDER BY created_at DESC").all() as PostRow[];
  return rows.map(rowToFeedPost);
};

export const findFeedPostById = (id: string): FeedPost | undefined => {
  const row = db.prepare("SELECT * FROM feed_posts WHERE id = ?").get(id) as PostRow | undefined;
  return row ? rowToFeedPost(row) : undefined;
};

export const incrementLikes = (id: string): number => {
  db.prepare("UPDATE feed_posts SET likes = likes + 1 WHERE id = ?").run(id);
  const row = db.prepare("SELECT likes FROM feed_posts WHERE id = ?").get(id) as { likes: number } | undefined;
  return row?.likes ?? 0;
};

export const decrementLikes = (id: string): number => {
  db.prepare("UPDATE feed_posts SET likes = MAX(0, likes - 1) WHERE id = ?").run(id);
  const row = db.prepare("SELECT likes FROM feed_posts WHERE id = ?").get(id) as { likes: number } | undefined;
  return row?.likes ?? 0;
};

export const incrementShares = (id: string): number => {
  db.prepare("UPDATE feed_posts SET shares = shares + 1 WHERE id = ?").run(id);
  const row = db.prepare("SELECT shares FROM feed_posts WHERE id = ?").get(id) as { shares: number } | undefined;
  return row?.shares ?? 0;
};

export const insertComment = (postId: string, comment: { id: string; userId: string; userName: string; text: string }): Comment => {
  db.prepare(
    "INSERT INTO comments (id, post_id, user_id, user_name, text) VALUES (?, ?, ?, ?, ?)"
  ).run(comment.id, postId, comment.userId, comment.userName, comment.text);
  const row = db.prepare("SELECT * FROM comments WHERE id = ?").get(comment.id) as CommentRow;
  return { id: row.id, userId: row.user_id, userName: row.user_name, text: row.text, createdAt: row.created_at };
};
