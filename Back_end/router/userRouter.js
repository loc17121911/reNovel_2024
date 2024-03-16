import { Router } from "express";
import express from "express";
import {
  deleteUser,
  getAllUsers,
  loginUser,
  registerUser,
  updateCheck,
  updateProfile,
  updateProfileAvatar,
  userProfile,
} from "../controllers/userControllers";

import { authGuard } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authGuard, userProfile);
router.put("/updateProfile", authGuard, updateProfile);
router.put("/updateProfileAvatar", authGuard, updateProfileAvatar);
router.get("/", getAllUsers);
router.delete("/:userId", deleteUser);
router.put("/check/:userId", updateCheck);
export default router;
