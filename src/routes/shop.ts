import { Router } from "express";

import {
  postCart,
  getCart,
  getIndex,
  getOrders,
  postOrder,
  getProduct,
  getProducts,
  postCartDeleteProduct,
} from "../controllers/shop";
const router = Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", getCart);

router.post("/cart", postCart);

router.post("/cart-delete-item", postCartDeleteProduct);

router.get("/orders", getOrders);

router.post("/create-order", postOrder);

export default router;
