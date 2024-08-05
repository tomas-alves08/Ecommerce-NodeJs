import { Router } from "express";

import {
  postDeleteProduct,
  getAddProduct,
  getEditProduct,
  getProducts,
  postAddProduct,
  postEditProduct,
} from "../controllers/admin";
import isAuth from "../middleware/is-auth";

const router = Router();

router.get("/add-product", isAuth, getAddProduct);

router.get("/products", isAuth, getProducts);

router.post("/add-product", isAuth, postAddProduct);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post("/edit-product", isAuth, postEditProduct);

router.post("/delete-product/:productId", isAuth, postDeleteProduct);

export default router;
