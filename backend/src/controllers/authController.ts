import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { OAuth2Client } from "google-auth-library";
import { config } from "../config/env.js";
import { findUserByEmail, findUserById, findUserByGoogleId, createUser } from "../models/UserPostgres.js";

const generateToken = (userId: string): string =>
  jwt.sign({ userId }, config.jwtSecret, { expiresIn: "7d" });

const googleClient = new OAuth2Client(
  config.googleClientId,
  config.googleClientSecret,
  "postmessage"
);

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({
      id: uuidv4(),
      name,
      email,
      passwordHash,
      avatar: name.charAt(0).toUpperCase(),
    });

    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, verified: user.verified },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, verified: user.verified },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token: googleToken } = req.body;

    if (!googleToken) {
      res.status(400).json({ error: "Google token is required" });
      return;
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      res.status(400).json({ error: "Invalid Google token payload" });
      return;
    }

    const { email, name, sub: googleId, picture } = payload;

    // Check if user exists by Google ID
    let user = await findUserByGoogleId(googleId);

    if (!user) {
      // Check if user exists by email (might have signed up with email/password)
      user = await findUserByEmail(email);
      
      if (!user) {
        // New user - create account
        const passwordHash = await bcrypt.hash(uuidv4(), 10); // Random password for Google users
        user = await createUser({
          id: uuidv4(),
          name: name || email.split("@")[0],
          email,
          passwordHash,
          googleId,
          avatar: name?.charAt(0).toUpperCase() || email.charAt(0).toUpperCase(),
        });
      } else {
        // Existing user - link Google account
        // In a real app, you might want to update the user record with googleId
        // For now, we'll just proceed with the existing account
      }
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, verified: user.verified },
      isNewUser: !(await findUserByGoogleId(googleId)) && !(await findUserByEmail(email)),
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: "Google authentication failed" });
  }
};

export const getMe = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  const { userId } = req as any;
  const user = await findUserById(userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, verified: user.verified },
  });
};
