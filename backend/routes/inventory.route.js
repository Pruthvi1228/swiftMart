import express from "express";

const router = express.Router();

import { addInventory, getInventoryByStore } from "../controllers/inventory.controller.js";

router.post("/addInventory", addInventory);
router.get("/:storeId", getInventoryByStore);

export default router;
