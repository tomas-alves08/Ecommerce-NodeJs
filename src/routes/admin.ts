import { Router } from "express";

import {
  deleteProduct,
  getAddProduct,
  getEditProduct,
  getProducts,
  postAddProduct,
  postEditProduct,
} from "../controllers/admin";
import isAuth from "../middleware/is-auth";
import { check } from "express-validator";

const router = Router();

router.get("/add-product", isAuth, getAddProduct);

router.get("/products", isAuth, getProducts);

router.post(
  "/add-product",
  isAuth,
  [
    check("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        "Title must contain only alpha numeric values and at least 3 characters long."
      )
      .trim(),
    check("price").isNumeric().withMessage("Price is required."),
    check("description")
      .isString()
      .isLength({ min: 5, max: 400 })
      .withMessage(
        "Description must contain only alpha numeric values and at least 5 characters long."
      )
      .trim(),
  ],
  postAddProduct
);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post(
  "/edit-product",
  isAuth,
  [
    check("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        "Title must contain only alpha numeric values and at least 3 characters long."
      )
      .trim(),
    // check("imageUrl")
    //   .isURL()
    //   .withMessage("Please enter a valid URL in the image field.")
    //   .trim(),
    check("price").isNumeric().withMessage("Price is required."),
    check("description")
      .isString()
      .isLength({ min: 5, max: 400 })
      .withMessage(
        "Description must contain only alpha numeric values and at least 5 characters long."
      )
      .trim(),
  ],
  postEditProduct
);

router.delete("/product/:productId", isAuth, deleteProduct);

export default router;
