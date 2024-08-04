import { Response } from "express";
import Product from "../models/product";
import { RequestCustom, SessionCustom } from "../util/schemas";

export async function getProducts(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  try {
    const products = await Product.find();
    console.log("products: ", products);
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      isAuthenticated: (req.session as SessionCustom).isLoggedIn,
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
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: (req.session as SessionCustom).isLoggedIn,
  });
}

export async function postAddProduct(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  const { title, imageUrl, description, price } = req.body;

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
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: editMode,
      product,
      isAuthenticated: (req.session as SessionCustom).isLoggedIn,
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

  try {
    const product = await Product.findById(prodId);
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

  console.log(prodId);

  try {
    await Product.findByIdAndDelete(prodId);
    res.redirect("/admin/products");
  } catch (err: any) {
    console.log(err.message);
  }
}
