"use strict";
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
// import { Product } from "./product";
// import { CartItem } from "./cart-item";
// import { OrderItem } from "./order-item";
// @Table({
//   tableName: "Orders",
// })
// export class Order extends Model<Order> {
//   @PrimaryKey
//   @Default(uuidv4)
//   @Column({
//     type: DataType.UUID,
//     defaultValue: DataType.UUIDV4,
//     allowNull: false,
//   })
//   id!: string;
//   @ForeignKey(() => User)
//   @Column({
//     type: DataType.UUID,
//     allowNull: false,
//   })
//   UserId!: string;
//   @BelongsTo(() => User)
//   user!: User;
//   @BelongsToMany(() => Product, () => OrderItem)
//   products!: Product[];
// }
