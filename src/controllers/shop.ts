import { Request, Response } from "express";
import { Product } from "../models/product";
import {
  ICart,
  IProduct,
  IProductWithQty,
  RequestCustom,
} from "../util/schemas";
import { getDb } from "../util/database";
import { ObjectId } from "mongodb";
// // import { Cart } from "../models/cart";
// import { ICart, IProduct } from "../util/schemas";

// // import { Product } from "../models/product";
// import { User } from "../models/user";
// // import { userId } from "../app";
// import { Cart } from "../models/cart";
// import { CartItem } from "../models/cart-item";
// import { Order } from "../models/order";
// import { OrderItem } from "../models/order-item";

// // type ProductCartItem = Product & CartItem;

export async function getProducts(req: Request, res: Response, next: Function) {
  try {
    const products = await Product.fetchAll();
    console.log("products: ", products);
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/products",
    });
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function getProduct(req: Request, res: Response, next: Function) {
  const prodId: string = req.params.productId;
  // console.log(
  try {
    const product = await Product.findById(prodId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product?.title,
      path: `/products`,
    });
  } catch (err: any) {
    console.log(err.message);
  }
  // );
}

export async function getIndex(req: Request, res: Response, next: Function) {
  try {
    const products = await Product.fetchAll();
    console.log("products: ", products);
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function getCart(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  try {
    const cartProducts = await req.user?.getCart();

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: cartProducts,
    });
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function postCart(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  try {
    const productId = req.body.productId || "";
    const product = await Product.findById(productId);
    if (product) {
      const user = await req.user?.addToCart(product as Product);
      console.log("User: ", user);
      res.redirect("/cart");
    }
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function postCartDeleteProduct(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  try {
    await req.user?.deleteItemFromCart(req.body.productId);
    res.redirect("/cart");
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function getOrders(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  try {
    const orders = await req.user?.getOrders();

    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders,
    });
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function postOrder(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  try {
    await req.user?.addOrder();

    res.redirect("/orders");
  } catch (err: any) {
    console.log(err.message);
  }
}

// // export function getCheckout(req: Request, res: Response, next: Function) {
// //   res.render("shop/checkout", {
// //     path: "/checkout",
// //     pageTitle: "Checkout",
// //   });
// // }
