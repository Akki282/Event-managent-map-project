import express from "express";
import {
  addGuestToEvent,
  addVendorToEvent,
  createEvent,
  getEventById,
  getEvents,
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createEvent);

router.get("/", protect, getEvents);

router.get("/:id", protect, getEventById);

router.post("/:id/guest", protect, addGuestToEvent);

router.post("/:id/vendor", protect, addVendorToEvent);

export default router;
