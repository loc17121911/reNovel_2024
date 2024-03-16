import express from "express";
import {
  createTag,
  deleteTag,
  getAllTags,
  getTagById,
  updateTag,
} from "../controllers/tagsControllers";
// import { createTag, deleteTag, updateTag } from "../controllers/tagsControllers";

const router = express.Router();

router.post("/", createTag);
router.get("/", getAllTags);
router.get("/:tagId", getTagById);
router.put("/:tagId", updateTag);
router.delete("/:tagId", deleteTag);

export default router;
