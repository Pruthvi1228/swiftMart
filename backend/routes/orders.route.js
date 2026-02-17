import express from "express";
import { createOrder } from "../controllers/orders.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = new express.Router();

router.post("/", protect, createOrder);

export default router;