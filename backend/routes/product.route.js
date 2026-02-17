import express from "express";

const router = express.Router();

import { createProduct, getProduct} from "../controllers/product.controller.js";


router.post("/create", createProduct);
router.get("/get", getProduct);

export default router;
