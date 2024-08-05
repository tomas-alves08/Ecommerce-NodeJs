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
import isAuth from "../middleware/is-auth";

const router = Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item", isAuth, postCartDeleteProduct);

router.get("/orders", isAuth, getOrders);

router.post("/create-order", isAuth, postOrder);

export default router;
