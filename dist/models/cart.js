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
// @Table({
//   tableName: "Carts",
// })
// export class Cart extends Model<Cart> {
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
//   @BelongsToMany(() => Product, () => CartItem)
//   products!: Product[];
//   // Define the method signature for getProducts
//   //   public getProducts!: () => Promise<Product[]>;
//   //   public async getProduct(id: string): Promise<Product | null> {
//   //     console.log("ID: ", id);
//   //     return Product.findOne({ where: { id, UserId: this.id } });
//   //   }
// }
