import { Response } from "express";
import Product from "../models/product";
import { IError, RequestCustom, SessionCustom } from "../util/schemas";
import Order from "../models/order";

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
        name: req.user?.email,
        userId: req.user?._id,
      },
      products: cartProducts,
    });
    console.log("order: ", order.products);
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
