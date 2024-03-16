import { Router } from "express";
import express from "express";
import {
  checkMutilPost,
  createPost,
  deletePost,
  getAllPosts,

  // getAllPostsSecond,
  getPostDetail,
  getPostUser,
  // importExcelData,
  updatePost,
} from "../controllers/postControllers";

import { adminGuard, authGuard } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authGuard, adminGuard, createPost);
router.put("/:slug", authGuard, adminGuard, updatePost);
router.delete("/:slug", authGuard, adminGuard, deletePost);
router.get("/:slug", getPostDetail);
router.get("/", getAllPosts);
router.get("/user/:userId", getPostUser);
router.put("/checked/mutilpost", checkMutilPost);

export default router;
