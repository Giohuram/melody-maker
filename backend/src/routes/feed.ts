import { Router } from "express";
import {
  getFeed,
  getFeedPost,
  likePost,
  unlikePost,
  addComment,
  sharePost,
} from "../controllers/feedController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", getFeed);
router.get("/:id", getFeedPost);

// Protected actions
router.post("/:id/like", authenticate, likePost);
router.post("/:id/unlike", authenticate, unlikePost);
router.post("/:id/comments", authenticate, addComment);
router.post("/:id/share", authenticate, sharePost);

export default router;
