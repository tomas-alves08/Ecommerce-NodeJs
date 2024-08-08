import { Request } from "express";
import { ObjectId } from "mongodb";
import User from "../models/user";
import Product from "../models/product";
import { Document } from "mongoose";
import { Session } from "express-session";

export interface IProduct {
  _id?: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
}

export interface IProductWithQty extends IProduct {
  quantity: number;
}

export interface IOrder {
  _id: ObjectId;
  products: {
    productData: IProduct;
    quantity: number;
  }[];
  user: {
    email: string;
    userId: ObjectId;
  };
}

export interface ICart {
  items: ICartItem[];
}

export interface ICartItem {
  productId: ObjectId;
  quantity: number;
}

export interface IUser extends Document {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  cart: ICart;
  resetToken?: string;
  resetTokenExpiration?: Date;
  addToCart: (product: InstanceType<typeof Product>) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

// export interface IUser {
//   _id?: ObjectId;
//   password: string;
//   email: string;
// }

export interface RequestCustom extends Request {
  user?: InstanceType<typeof User> | null;
  file?: Express.Multer.File;
}

export interface SessionCustom extends Session {
  isLoggedIn: boolean;
  user: InstanceType<typeof User> | null;
}

export interface IError extends Error {
  httpStatusCode?: number;
}
