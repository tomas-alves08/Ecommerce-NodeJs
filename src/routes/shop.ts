import { Router } from "express";

import {
  postCart,
  getCart,
  getCheckout,
  getIndex,
  getOrders,
  getProduct,
  getProducts,
  postDeleteCart,
} from "../controllers/shop";
const router = Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", getCart);

router.post("/cart", postCart);

router.post("/cart-delete-item", postDeleteCart);

router.get("/orders", getOrders);

router.get("/checkout", getCheckout);

export default router;
