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
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  apiVersion: "2024-06-20",
});
// console.log(process.env.STRIPE_API_KEY);

const ITEMS_PER_PAGE = 1;

export async function getProducts(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  const page: number = Number(req.query.page) || 1;

  try {
    const totalItems = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    console.log("products: ", products);
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Products",
      path: "/products",
      currentPage: page,
      hasNextPage: totalItems > page * ITEMS_PER_PAGE,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
    const page: number = Number(req.query.page) || 1;

    const totalItems = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    console.log("products: ", products);
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      currentPage: page,
      hasNextPage: totalItems > page * ITEMS_PER_PAGE,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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

export async function getInvoice(
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

export async function getCheckout(
  req: RequestCustom,
  res: Response,
  next: Function
) {
  try {
    const user = await req.user?.populate("cart.items.productId");

    const cartProducts = user?.cart.items;
    console.log(cartProducts);

    if (!cartProducts) return;

    let totalCost = 0;
    cartProducts?.forEach((prod) => {
      totalCost += prod.quantity * prod.productId.price;
    });

    // Create a Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartProducts.map((prod) => {
        return {
          price_data: {
            currency: "nzd",
            product_data: {
              name: prod.productId.title,
              description: prod.productId.description,
            },
            // times 100 to make it up as Stripe takes 2 first digits as cents
            unit_amount: prod.productId.price * 100,
          },
          quantity: prod.quantity,
        };
      }),
      mode: "payment",
      success_url: req.protocol + "://" + req.get("host") + "/checkout/success",
      cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
    });

    console.log("Stripe session: ", session);

    res.render("shop/checkout", {
      path: "/checkout",
      pageTitle: "Checkout",
      products: cartProducts,
      totalCost: totalCost,
      sessionId: session.id,
    });
  } catch (err: any) {
    const error: IError = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}

export async function getCheckoutSuccess(
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
