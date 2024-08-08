import { Response } from "express";
import Product from "../models/product";
import {
  IError,
  IOrder,
  IUser,
  RequestCustom,
  SessionCustom,
} from "../util/schemas";
import Order from "../models/order";
import path from "path";
import fs from "fs";
import pdfkit from "pdfkit";

export async function getProducts(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  try {
    const products = await Product.find();
    console.log("products: ", products);
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/products",
      // isAuthenticated: (req.session as SessionCustom).isLoggedIn,
    });
  } catch (err: any) {
    const error: IError = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}

export async function getProduct(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  const prodId: string = req.params.productId;
  // console.log(
  try {
    const product = await Product.findById(prodId);

    res.render("shop/product-detail", {
      product: product,
      pageTitle: product?.title,
      path: `/products`,
      // isAuthenticated: (req.session as SessionCustom).isLoggedIn,
    });
  } catch (err: any) {
    const error: IError = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
  // );
}

export async function getIndex(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  try {
    const products = await Product.find();
    console.log("products: ", products);
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (err: any) {
    const error: IError = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}

export async function getCart(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  try {
    const user = await req.user?.populate("cart.items.productId");

    const cartProducts = user?.cart.items;
    console.log(cartProducts);

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: cartProducts,
      // isAuthenticated: (req.session as SessionCustom).isLoggedIn,
    });
  } catch (err: any) {
    const error: IError = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
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
      const user = await req.user?.addToCart(
        product as InstanceType<typeof Product>
      );
      console.log("User: ", user);
      res.redirect("/cart");
    }
  } catch (err: any) {
    const error: IError = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}

export async function postCartDeleteProduct(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  try {
    await req.user?.removeFromCart(req.body.productId);
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
    const orders = await Order.find({
      "user.userId": req.user?._id,
    });
    console.log(orders);

    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders,
      // isAuthenticated: (req.session as SessionCustom).isLoggedIn,
    });
  } catch (err: any) {
    const error: IError = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}

export async function postOrder(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  try {
    const user = await req.user?.populate("cart.items.productId");

    const cartProducts = user?.cart.items.map((item: any) => {
      return {
        quantity: item.quantity,
        productData: { ...item.productId.toObject() },
      };
    });

    const order = new Order({
      user: {
        email: req.user?.email,
        userId: req.user?._id,
      },
      products: cartProducts,
    });

    await order.save();

    // Clear the user's cart
    await req.user?.clearCart();

    res.redirect("/orders");
  } catch (err: any) {
    const error: IError = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}

export async function GetInvoice(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  const orderId = req.params.orderId;

  try {
    const order = (await Order.findById(orderId)) as IOrder;
    if (!order) return next("No order found.");
    const user = req.user;

    if (order?.user?.userId.toString() !== user?._id.toString())
      return next(new Error("You are not authorized to see this file."));

    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("src", "data", "invoices", invoiceName);

    const pdfDocument = new pdfkit();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename='" + invoiceName + "'"
    );

    pdfDocument.pipe(fs.createWriteStream(invoicePath));
    pdfDocument.pipe(res);

    pdfDocument.fontSize(26).text("Invoice", {
      underline: true,
    });
    pdfDocument.text("------------------------------");

    let totalPrice = 0;
    order.products.forEach((prod) => {
      totalPrice += prod.productData.price * prod.quantity;
      pdfDocument.fontSize(20).text(prod.productData.title);
      pdfDocument
        .fontSize(14)
        .text(
          "Price: $" + prod.productData.price + " | Quantity: " + prod.quantity
        );
      pdfDocument
        .fontSize(14)
        .text("Description: $" + prod.productData.description);

      pdfDocument.text("--------");
    });

    pdfDocument.fontSize(18).text("Total: " + totalPrice);

    pdfDocument.end();
    // fs.readFile(invoicePath, (err, data) => {
    //   console.log(err);
    //   if (err) return next(err);

    //   res.setHeader("Content-Type", "application/pdf");
    //   res.setHeader(
    //     "Content-Disposition",
    //     "inline; filename='" + invoiceName + "'"
    //   );
    //   res.send(data);
    // });

    // // HOW TO PIPE LARGE PDF FILES
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader("Content-Type", "application/pdf");
    //   res.setHeader(
    //     "Content-Disposition",
    //     "inline; filename='" + invoiceName + "'"
    //   );
    // file.pipe(res);
  } catch (err: any) {
    const error: IError = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}
