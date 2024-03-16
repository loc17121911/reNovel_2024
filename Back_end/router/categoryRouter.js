import { Router } from "express";
import express from "express";

import { adminGuard, authGuard } from "../middleware/authMiddleware";
import {
  createPostCategory,
  deletePostCategory,
  getAllPostCategory,
  getDetailCategory,
  updatePostCategory,
} from "../controllers/categoryControllers";

const router = express.Router();
router.post("/", createPostCategory);
router.get("/", getAllPostCategory);
router.get("/:_id", getDetailCategory);
router.put("/:postCategoryId", updatePostCategory);
router.delete("/:postCategoryId", deletePostCategory);

export default router;
