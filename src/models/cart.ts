import fs from "fs";
import path from "path";
import { IOrder } from "../util/schemas";

const filePath = path.join(
  path.dirname(require.main?.filename || ""),
  "data",
  "cart.json"
);

export class Cart {
  static addProduct(id: string, productPrice: number) {
    fs.readFile(filePath, (err, fileContent) => {
      let cart: {
        orders: IOrder[];
        totalPrice: number;
      } = {
        orders: [],
        totalPrice: 0,
      };
      if (!err) {
        console.log("fileContent", fileContent.toString());
        cart = JSON.parse(fileContent.toString());
      }
      console.log("err: ", err);

      const existingOrderIndex = cart.orders.findIndex(
        (order) => order.id === id
      );

      console.log("existingOrderIndex: ", existingOrderIndex);
      const existingOrder = cart.orders.find((order) => order.id === id);

      console.log("existingOrder: ", existingOrder);

      let updatedOrder: IOrder;
      if (existingOrder) {
        updatedOrder = { ...existingOrder };
        updatedOrder.qty = updatedOrder.qty + 1;
        cart.orders = [...cart.orders];
        cart.orders[existingOrderIndex] = updatedOrder;
      } else {
        updatedOrder = { id, qty: 1, price: Number(productPrice) };
        cart.orders = [...cart.orders, updatedOrder];
      }

      cart.totalPrice = Number(cart.totalPrice) + Number(productPrice);

      console.log("cart: ", cart);

      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id: string, productPrice: number) {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) return;

      console.log("fileContent: ", fileContent.toString());

      const cartInfo = JSON.parse(fileContent.toString());

      const updatedCart = { ...cartInfo };
      const order = cartInfo.orders.find((order: IOrder) => order.id === id);
      if (!order) return;

      const orderQty = order.qty;

      updatedCart.orders = updatedCart.orders.filter(
        (order: IOrder) => order.id !== id
      );

      updatedCart.totalPrice = cartInfo.totalPrice - orderQty * productPrice;

      fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(callbackFn: Function) {
    fs.readFile(filePath, (err, fileContent) => {
      const cart = JSON.parse(fileContent.toString());

      if (err) callbackFn(null);
      else callbackFn(cart);
    });
  }
}
