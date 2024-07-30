import { ObjectId } from "mongodb";

export interface IProduct {
  _id?: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
}

export interface IOrder {
  id: string;
  qty: number;
  price: number;
}

export interface ICart {
  id: string;
  UserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
}
