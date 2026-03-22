import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { findProjectsByUser, findProjectById, insertProject, updateProjectById, deleteProjectById } from "../models/Project.js";
import type { AuthRequest } from "../middleware/auth.js";

export const getProjects = (req: AuthRequest, res: Response): void => {
  const userProjects = findProjectsByUser(req.userId!);
  res.json({ projects: userProjects });
};

export const getProject = (req: AuthRequest, res: Response): void => {
  const project = findProjectById(req.params.id as string);
  if (!project || project.userId !== req.userId) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json({ project });
};

export const createProject = (req: AuthRequest, res: Response): void => {
  const { title, artist, format, duration, lyrics, style } = req.body;

  if (!title || !artist) {
    res.status(400).json({ error: "Title and artist are required" });
    return;
  }

  const project = insertProject({
    id: uuidv4(),
    userId: req.userId!,
    title,
    artist,
    format: format || "tiktok",
    duration: duration || "0:00",
    lyrics: lyrics || [],
    style: style || {
      template: "neon",
      fontStyle: "montserrat",
      textPosition: "center",
      transition: "fade",
      showProgress: true,
      karaoke: false,
    },
  });

  res.status(201).json({ project });
};

export const updateProject = (req: AuthRequest, res: Response): void => {
  const updated = updateProjectById(req.params.id as string, req.userId!, req.body);
  if (!updated) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json({ project: updated });
};

export const deleteProject = (req: AuthRequest, res: Response): void => {
  const deleted = deleteProjectById(req.params.id as string, req.userId!);
  if (!deleted) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json({ message: "Project deleted" });
};

export const getStats = (req: AuthRequest, res: Response): void => {
  const userProjects = findProjectsByUser(req.userId!);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  res.json({
    stats: {
      totalProjects: userProjects.length,
      completedVideos: userProjects.filter((p) => p.status === "completed").length,
      creditsRemaining: 10,
      thisMonth: userProjects.filter((p) => new Date(p.createdAt) >= monthStart).length,
    },
  });
};
