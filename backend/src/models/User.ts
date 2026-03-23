import db from "../config/database.js";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  googleId?: string;
  avatar: string;
  verified: boolean;
  createdAt: string;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  google_id: string;
  avatar: string;
  verified: number;
  created_at: string;
}

const rowToUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  passwordHash: row.password_hash,
  googleId: row.google_id || undefined,
  avatar: row.avatar,
  verified: row.verified === 1,
  createdAt: row.created_at,
});

export const findUserByEmail = (email: string): User | undefined => {
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
  return row ? rowToUser(row) : undefined;
};

export const findUserById = (id: string): User | undefined => {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
  return row ? rowToUser(row) : undefined;
};

export const createUser = (user: { id: string; name: string; email: string; passwordHash: string; googleId?: string; avatar: string }): User => {
  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, google_id, avatar, verified) VALUES (?, ?, ?, ?, ?, ?, 0)"
  ).run(user.id, user.name, user.email, user.passwordHash, user.googleId || null, user.avatar);
  return findUserById(user.id)!;
};

export const findUserByGoogleId = (googleId: string): User | undefined => {
  const row = db.prepare("SELECT * FROM users WHERE google_id = ?").get(googleId) as UserRow | undefined;
  return row ? rowToUser(row) : undefined;
};
