import express from "express";
import {
    createVendor,
    getVendorById,
    getVendors
} from "../controllers/vendorController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createVendor);

router.get("/", protect, getVendors);

router.get("/:id", protect, getVendorById);

export default router;