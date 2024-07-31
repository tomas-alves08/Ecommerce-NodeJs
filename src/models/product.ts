// import {
//   Table,
//   Column,
//   Model,
//   DataType,
//   Default,
//   PrimaryKey,
//   ForeignKey,
//   BelongsTo,
//   BelongsToMany,
// } from "sequelize-typescript";
// import { v4 as uuidv4 } from "uuid";
// import { User } from "./user";
// import { Cart } from "./cart";
// import { CartItem } from "./cart-item";
// import { Order } from "./order";
// import { OrderItem } from "./order-item";

// @Table({
//   tableName: "Products",
// })
// export class Product extends Model<Product> {
//   @PrimaryKey
//   @Default(uuidv4)
//   @Column({
//     type: DataType.UUID,
//     defaultValue: DataType.UUIDV4,
//     allowNull: false,
//   })
//   id!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   title!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   imageUrl!: string;

//   @Column({
//     type: DataType.TEXT,
//     allowNull: false,
//   })
//   description!: string;

//   @Column({
//     type: DataType.FLOAT,
//     allowNull: false,
//   })
//   price!: number;

//   @ForeignKey(() => User)
//   @Column({
//     type: DataType.UUID,
//     allowNull: false,
//   })
//   UserId!: string;

//   @BelongsTo(() => User)
//   user!: User;

//   @BelongsToMany(() => Cart, () => CartItem)
//   carts!: Cart[];

//   @BelongsToMany(() => Order, () => OrderItem)
//   orders!: Order[];
// }

import { ObjectId } from "mongodb";
import { getDb } from "../util/database";
import { IProduct } from "../util/schemas";

export class Product {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  _id?: ObjectId;
  userId?: ObjectId;

  constructor(
    title: string,
    price: number,
    description: string,
    imageUrl: string,
    userId?: ObjectId,
    id?: ObjectId
  ) {
    this._id = id ? new ObjectId(id) : undefined;
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId ? userId : undefined;
  }

  async save() {
    try {
      const db = getDb();
      return await db.collection("products").insertOne(this);
    } catch (err: any) {
      console.log(err.message);
    }
  }

  static async fetchAll() {
    try {
      const db = getDb();
      return await db.collection("products").find().toArray();
    } catch (err: any) {
      console.log(err.message);
    }
  }

  static async findById(prodId: string) {
    // Transforming prodId to type ObjectId
    const id = new ObjectId(prodId);

    try {
      const db = getDb();
      return await db.collection("products").findOne({ _id: id });
    } catch (err: any) {
      console.log(err.message);
    }
  }

  static async update(prodId: string, updatedProd: IProduct) {
    const db = getDb();
    const id = new ObjectId(prodId);

    try {
      return await db
        .collection("products")
        .updateOne({ _id: id }, { $set: updatedProd });
    } catch (err: any) {
      console.log(err.message);
    }
  }

  static async deleteById(prodId: string) {
    try {
      const db = getDb();
      const id = new ObjectId(prodId);

      return await db.collection("products").deleteOne({ _id: id });
    } catch (err: any) {
      console.log(err.message);
    }
  }
}
