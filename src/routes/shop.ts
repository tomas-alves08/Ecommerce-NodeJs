import { Router } from "express";

import {
  postCart,
  getCart,
  getIndex,
  getOrders,
  // postOrder,
  getProduct,
  getProducts,
  postCartDeleteProduct,
  getInvoice,
  getCheckout,
  getCheckoutSuccess,
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

// router.post("/create-order", isAuth, postOrder);

router.get("/orders/:orderId", isAuth, getInvoice);

router.get("/checkout", isAuth, getCheckout);

router.get("/checkout/success", isAuth, getCheckoutSuccess);

router.get("/checkout/cancel", isAuth, getCheckout);

export default router;
