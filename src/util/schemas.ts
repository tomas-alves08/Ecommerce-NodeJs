import { Request } from "express";
import { ObjectId } from "mongodb";
import { User } from "../models/user";

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
  id: string;
  qty: number;
  price: number;
}

export interface ICart {
  items: { productId: ObjectId; quantity: number }[];
}

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
}

export interface RequestCustom extends Request {
  user?: User | null;
}
