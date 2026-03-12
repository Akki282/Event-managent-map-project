import express from "express";
import {
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", protect, getUser);

router.put("/:id", protect, updateUser);

router.delete("/:id", protect, deleteUser);

export default router;
