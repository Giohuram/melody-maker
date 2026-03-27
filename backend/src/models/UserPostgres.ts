import pool from "../config/postgres.js";

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

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (result.rows.length === 0) return undefined;
  return rowToUser(result.rows[0]);
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  if (result.rows.length === 0) return undefined;
  return rowToUser(result.rows[0]);
};

export const createUser = async (user: { id: string; name: string; email: string; passwordHash: string; googleId?: string; avatar: string }): Promise<User> => {
  await pool.query(
    "INSERT INTO users (id, name, email, password_hash, google_id, avatar, verified) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [user.id, user.name, user.email, user.passwordHash, user.googleId || null, user.avatar, false]
  );
  const created = await findUserById(user.id);
  return created!;
};

export const findUserByGoogleId = async (googleId: string): Promise<User | undefined> => {
  const result = await pool.query("SELECT * FROM users WHERE google_id = $1", [googleId]);
  if (result.rows.length === 0) return undefined;
  return rowToUser(result.rows[0]);
};

const rowToUser = (row: any): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  passwordHash: row.password_hash,
  googleId: row.google_id || undefined,
  avatar: row.avatar,
  verified: row.verified,
  createdAt: row.created_at,
});
