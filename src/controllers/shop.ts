import { Request, Response } from "express";
import { Product } from "../models/product";
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

// export async function getCart(req: Request, res: Response, next: Function) {
//   try {
//     const user = await User.findByPk(userId, {
//       include: [
//         {
//           model: Cart,
//           include: [
//             {
//               model: Product,
//               through: { attributes: ["quantity"] },
//             },
//           ],
//         },
//       ],
//     });

//     const cart = user?.cart;
//     console.log("CART: ", cart);

//     const cartProducts = cart?.products.map((product: any) => {
//       console.log("PRODUCT: ", product);
//       return {
//         ...product.get({ plain: true }),
//         quantity: product.CartItem.quantity,
//       };
//     });

//     console.log("Cart Products: ", cartProducts);

//     res.render("shop/cart", {
//       path: "/cart",
//       pageTitle: "Your Cart",
//       products: cartProducts,
//     });
//   } catch (err: any) {
//     console.log(err.message);
//   }
// }

// export async function postCart(req: Request, res: Response, next: Function) {
//   try {
//     const productId = req.body.productId || "";
//     const user = await User.findByPk(userId);
//     const fetchedCart: Cart | null = (await user?.getCart()) || null;
//     const product = await Product.findByPk(productId);
//     const cartItem = await CartItem.findOne({
//       where: {
//         CartId: fetchedCart?.id,
//         ProductId: productId,
//       },
//     });

//     if (!fetchedCart || !product) {
//       return res.redirect("/cart");
//     }

//     console.log("Cart Item: ", cartItem);
//     if (!cartItem) {
//       await CartItem.create({
//         CartId: fetchedCart?.id,
//         ProductId: product?.id,
//         quantity: 1,
//       } as any);
//     } else {
//       cartItem.quantity += 1;
//       await cartItem.save();
//     }

//     res.redirect("/cart");
//   } catch (err: any) {
//     console.log(err.message);
//   }
// }

// export async function postCartDeleteProduct(
//   req: Request,
//   res: Response,
//   next: Function
// ) {
//   const prodId = req.body.productId;
//   try {
//     const user = await User.findByPk(userId, {
//       include: [
//         {
//           model: Cart,
//           include: [
//             {
//               model: Product,
//               through: { attributes: ["quantity"] },
//             },
//           ],
//         },
//       ],
//     });

//     const cart = user?.cart;
//     const product = cart?.products.find((prod) => prod.id === prodId);
//     if (product) {
//       const cartItem = await CartItem.findOne({
//         where: {
//           CartId: cart?.id,
//           ProductId: product?.id,
//         },
//       });

//       if (cartItem) await cartItem.destroy();
//     }

//     res.redirect("/cart");
//   } catch (err: any) {
//     console.log(err.message);
//   }
// }

// export async function getOrders(req: Request, res: Response, next: Function) {
//   try {
//     const user = await User.findByPk(userId, {
//       include: [
//         {
//           model: Order,
//           include: [
//             {
//               model: Product,
//               through: { attributes: ["quantity"] },
//             },
//           ],
//         },
//       ],
//     });

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     const ordersWithoutDetails = await Order.findAll({
//       where: { UserId: user.id },
//       include: [
//         {
//           model: Product,
//           through: {
//             attributes: ["quantity"],
//           },
//         },
//       ],
//     });

//     const orders = ordersWithoutDetails.map((order) => {
//       return {
//         id: order.id,
//         createdAt: order.createdAt,
//         updatedAt: order.updatedAt,
//         products: order.products.map((product) => {
//           return {
//             ...product.get({ plain: true }),
//             quantity: (product as any).OrderItem.quantity,
//           };
//         }),
//       };
//     });

//     // console.log("PRODUCTS WITH QTY + ORDER ID: ", products);

//     res.render("shop/orders", {
//       path: "/orders",
//       pageTitle: "Your Orders",
//       orders,
//     });
//   } catch (err: any) {
//     console.log(err.message);
//   }
// }

// export async function postOrder(req: Request, res: Response, next: Function) {
//   try {
//     const user = await User.findByPk(userId, {
//       include: [
//         {
//           model: Cart,
//           include: [
//             {
//               model: Product,
//               through: { attributes: ["quantity"] },
//             },
//           ],
//         },
//       ],
//     });

//     const cart = await user?.cart;
//     // console.log("CART: ", cart);
//     const products = cart?.products;

//     // const newOrder = await user?.createOrder();
//     const order = await Order.create({
//       UserId: userId,
//     } as any);

//     const cartItems = await Promise.all(
//       products?.map(async (product) => {
//         return CartItem.findOne({
//           where: {
//             ProductId: product.id,
//           },
//         } as any);
//       }) as any
//     );

//     const orderItems = await Promise.all(
//       products?.map(async (product) => {
//         const cartItem = cartItems.find(
//           (item) => item.ProductId === product.id
//         );

//         return OrderItem.create({
//           ProductId: product.id,
//           OrderId: order?.id,
//           quantity: cartItem.quantity,
//         } as any);
//       }) as any
//     );
//     console.log("ORDERS: ", orderItems);

//     // DELETE CART ITEMS
//     if (orderItems) {
//       await Promise.all(
//         cartItems?.map(async (item) => {
//           const cartItem = await CartItem.findByPk(item.id);
//           await cartItem?.destroy();
//         })
//       );
//     }

//     res.redirect("/orders");
//   } catch (err: any) {
//     console.log(err.message);
//   }
// }

// // export function getCheckout(req: Request, res: Response, next: Function) {
// //   res.render("shop/checkout", {
// //     path: "/checkout",
// //     pageTitle: "Checkout",
// //   });
// // }
