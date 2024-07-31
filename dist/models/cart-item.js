"use strict";
// import {
//   Table,
//   Column,
//   Model,
//   DataType,
//   Default,
//   PrimaryKey,
//   ForeignKey,
// } from "sequelize-typescript";
// import { v4 as uuidv4 } from "uuid";
// import { Cart } from "./cart";
// import { Product } from "./product";
// @Table({
//   tableName: "CartItems",
// })
// export class CartItem extends Model<CartItem> {
//   @PrimaryKey
//   @Default(uuidv4)
//   @Column({
//     type: DataType.UUID,
//     defaultValue: DataType.UUIDV4,
//     allowNull: false,
//   })
//   id!: string;
//   @Column({
//     type: DataType.INTEGER,
//     allowNull: false,
//   })
//   quantity!: number;
//   @ForeignKey(() => Cart)
//   @Column({
//     type: DataType.UUID,
//     allowNull: false,
//   })
//   CartId!: string;
//   @ForeignKey(() => Product)
//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   ProductId!: string;
// }
