import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  getAllFeedPosts,
  findFeedPostById,
  incrementLikes,
  decrementLikes,
  incrementShares,
  insertComment,
} from "../models/FeedPost.js";
import type { AuthRequest } from "../middleware/auth.js";

const formatViews = (n: number): string => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return Math.round(n / 1000) + "K";
  return n.toString();
};

export const getFeed = (_req: Request, res: Response): void => {
  const posts = getAllFeedPosts().map((p) => ({
    ...p,
    viewsFormatted: formatViews(p.views),
    commentsCount: p.comments.length,
  }));
  res.json({ posts });
};

export const getFeedPost = (req: Request, res: Response): void => {
  const post = findFeedPostById(req.params.id as string);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json({ post: { ...post, viewsFormatted: formatViews(post.views) } });
};

export const likePost = (req: AuthRequest, res: Response): void => {
  const post = findFeedPostById(req.params.id as string);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  const likes = incrementLikes(req.params.id as string);
  res.json({ likes });
};

export const unlikePost = (req: AuthRequest, res: Response): void => {
  const post = findFeedPostById(req.params.id as string);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  const likes = decrementLikes(req.params.id as string);
  res.json({ likes });
};

export const addComment = (req: AuthRequest, res: Response): void => {
  const post = findFeedPostById(req.params.id as string);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const { text, userName } = req.body;
  if (!text) {
    res.status(400).json({ error: "Comment text is required" });
    return;
  }

  const comment = insertComment(req.params.id as string, {
    id: uuidv4(),
    userId: req.userId!,
    userName: userName || "Anonymous",
    text,
  });

  res.status(201).json({ comment });
};

export const sharePost = (req: AuthRequest, res: Response): void => {
  const post = findFeedPostById(req.params.id as string);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  const shares = incrementShares(req.params.id as string);
  res.json({ shares });
};
