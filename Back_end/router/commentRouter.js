import { Router } from "express";
import express from "express";
import {
  checkMultiComments,
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from "../controllers/commentControllers";

import { adminGuard, authGuard } from "../middleware/authMiddleware";

const router = express.Router();
router.post("/", authGuard, createComment);
router.put("/:commentId", authGuard, updateComment);
router.delete("/:commentId", authGuard, deleteComment);
router.get("/", getAllComments);
router.put("/check/multiComments", checkMultiComments);

export default router;
