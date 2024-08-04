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
    name: string;
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
  name: string;
  email: string;
  cart: ICart;
  addToCart: (product: InstanceType<typeof Product>) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
}

export interface RequestCustom extends Request {
  user?: InstanceType<typeof User> | null;
}

export interface SessionCustom extends Session {
  isLoggedIn: boolean;
  user: InstanceType<typeof User> | null;
}
