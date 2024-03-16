import express from "express";
import { authGuard } from "../middleware/authMiddleware.js";
import {
  createRating,
  getRatingsByPostId,
} from "../controllers/ratingControllers.js";

const router = express.Router();

router.post("/:postId", authGuard, createRating);
router.get("/:postId", getRatingsByPostId);

export default router;
