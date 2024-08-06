import { Response } from "express";
import Product from "../models/product";
import { RequestCustom, SessionCustom } from "../util/schemas";
import { ObjectId } from "mongoose";
import { validationResult } from "express-validator";

export async function getProducts(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  try {
    const products = await Product.find({ userId: req.user?._id });
    console.log("products: ", products);
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      // isAuthenticated: (req.session as SessionCustom).isLoggedIn,
    });
  } catch (err: any) {
    console.log(err.message);
  }
}

export function getAddProduct(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  // if (!(req.session as SessionCustom).isLoggedIn) return res.redirect("/login");

  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    oldInput: { title: "", imageUrl: "", description: "", price: "" },
  });
}

export async function postAddProduct(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  const { title, imageUrl, description, price } = req.body;

  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: { title, imageUrl, description, price },
    });
  }

  try {
    const product = await new Product({
      title,
      price,
      description,
      imageUrl,
      userId: req.user,
    });
    await product.save();
    console.log("created a product");
    res.redirect("/");
  } catch (err: any) {
    console.log(err);
  }
}

export async function getEditProduct(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product,
      hasError: false,
      errorMessage: null,
      // isAuthenticated: (req.session as SessionCustom).isLoggedIn,
    });
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function postEditProduct(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  const prodId = req.body.productId;
  const { title, imageUrl, description, price } = req.body;

  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: { title, imageUrl, description, price },
    });
  }

  try {
    const product = await Product.findById(prodId);

    if ((product?.userId as ObjectId).toString() !== req.user?._id.toString())
      return res.redirect("/");

    if (product) {
      product.title = title;
      product.description = description;
      product.imageUrl = imageUrl;
      product.price = price;

      await product.save();

      res.redirect("/admin/products");
    } else res.redirect("/");
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function postDeleteProduct(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  const prodId = req.params.productId;

  try {
    await Product.deleteOne({ _id: prodId, userId: req.user?._id });
    res.redirect("/admin/products");
  } catch (err: any) {
    console.log(err.message);
  }
}
