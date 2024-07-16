import { Request, Response } from "express";
import { Product } from "../models/product";
import { Cart } from "../models/cart";
import { ICart, IProduct } from "../util/schemas";

export function getProducts(req: Request, res: Response, next: Function) {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
}

export function getProduct(req: Request, res: Response, next: Function) {
  const prodId = req.params.productId;
  console.log(
    Product.findById(prodId, (product: IProduct) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: "Product Detail",
        path: `/products`,
      });
    })
  );
}

export function getIndex(req: Request, res: Response, next: Function) {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
}

export function getCart(req: Request, res: Response, next: Function) {
  Cart.getCart((cart: ICart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (const prod of products) {
        const cartProductData = cart.orders.find(
          (order) => order.id === prod.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: prod, qty: cartProductData.qty });
        }
      }

      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
}

export function postCart(req: Request, res: Response, next: Function) {
  const productId = req.body.productId;
  Product.findById(productId, (product: IProduct) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
}

export function postDeleteCart(req: Request, res: Response, next: Function) {
  const prodId = req.body.productId;
  Product.findById(prodId, (product: IProduct) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
}

export function getOrders(req: Request, res: Response, next: Function) {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
}

export function getCheckout(req: Request, res: Response, next: Function) {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
}
