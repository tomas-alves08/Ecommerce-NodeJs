export interface IProduct {
  id?: string;
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
  name: string;
  email: string;
}
