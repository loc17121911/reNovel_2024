import { Router } from "express";
import express from "express";
import {
  createFavorite,
  getFavoritesByPostId,
  getPostFavorite,
} from "../controllers/favoriteControllers";
import { authGuard } from "../middleware/authMiddleware";

const router = express.Router();
router.post("/:postId", authGuard, createFavorite);
router.get("/:userId", getPostFavorite);
router.get("/count/:postId", getFavoritesByPostId);

export default router;
