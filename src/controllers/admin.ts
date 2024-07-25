import { Request, Response } from "express";
import { Product } from "../models/product";
import { IProduct } from "../util/schemas";
import { User } from "../models/user";
import { userId } from "../app";

export async function getProducts(req: Request, res: Response, next: Function) {
  try {
    const user = await User.findByPk(userId);
    const products = await user?.getProducts();
    console.log("products: ", products);
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (err: any) {
    console.log(err.message);
  }
}

export function getAddProduct(req: Request, res: Response, next: Function) {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
}

export async function postAddProduct(
  req: Request,
  res: Response,
  next: Function
) {
  const { title, imageUrl, description, price } = req.body;

  try {
    // const user = await User.findByPk("4c844722-2dbd-4232-93c3-d07c4a34eb0a");
    // console.log("user", user);

    // if (user) {
    await Product.create({
      title,
      imageUrl,
      description,
      price,
      UserId: userId,
    } as Product);
    console.log("created a product");
    res.redirect("/");
    // }
  } catch (err: any) {
    console.log(err);
  }
}

export async function getEditProduct(
  req: Request,
  res: Response,
  next: Function
) {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;

  try {
    const product = await Product.findByPk(prodId);
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: editMode,
      product,
    });
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function postEditProduct(
  req: Request,
  res: Response,
  next: Function
) {
  const prodId = req.body.productId;
  const { title, imageUrl, description, price } = req.body;

  try {
    const product = await Product.findByPk(prodId);
    if (product) {
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;

      await product.save();
      res.redirect("/admin/products");
    } else {
      res.redirect("/");
    }
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function postDeleteProduct(
  req: Request,
  res: Response,
  next: Function
) {
  const prodId = req.params.productId;

  console.log(prodId);

  try {
    const product = await Product.findByPk(prodId);
    if (product) {
      await product.destroy();
      res.redirect("/admin/products");
    }
  } catch (err: any) {
    console.log(err.message);
  }
}
