import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { addToCart, getCart, removeFromCart } from "../controllers/cart.controller.js";
import { checkoutCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/:storeId", protect, getCart);
router.delete("/", protect, removeFromCart);
router.post("/checkout", protect, checkoutCart);

export default router;
