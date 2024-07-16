import { Router } from "express";

import {
  postDeleteProduct,
  getAddProduct,
  getEditProduct,
  getProducts,
  postAddProduct,
  postEditProduct,
} from "../controllers/admin";

const router = Router();

router.get("/add-product", getAddProduct);

router.get("/products", getProducts);

router.post("/add-product", postAddProduct);

router.get("/edit-product/:productId", getEditProduct);

router.post("/edit-product", postEditProduct);

router.post("/delete-product/:productId", postDeleteProduct);

export default router;
