import { Request, Response } from "express";
import { Product } from "../models/product";
import { IProduct } from "../util/schemas";

export function getProducts(req: Request, res: Response, next: Function) {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
}

export function getAddProduct(req: Request, res: Response, next: Function) {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
}

export function postAddProduct(req: Request, res: Response, next: Function) {
  const { title, imageUrl, description, price } = req.body;

  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
}

export function getEditProduct(req: Request, res: Response, next: Function) {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  Product.findById(prodId, (product: IProduct) => {
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: editMode,
      product,
    });
  });
}

export function postEditProduct(req: Request, res: Response, next: Function) {
  const prodId = req.body.productId;
  const { title, imageUrl, description, price } = req.body;
  const updatedProduct = new Product(
    title,
    imageUrl,
    description,
    price,
    prodId
  );

  updatedProduct.save();
  res.redirect("/admin/products");
}

export function postDeleteProduct(req: Request, res: Response, next: Function) {
  const prodId = req.params.productId;

  console.log(prodId);

  Product.deleteById(prodId);
  res.redirect("/admin/products");
}
