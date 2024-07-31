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
// import { Cart } from "./cart";
// import { CartItem } from "./cart-item";
// import { Order } from "./order";
// import { OrderItem } from "./order-item";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
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
const mongodb_1 = require("mongodb");
const database_1 = require("../util/database");
class Product {
    constructor(title, price, description, imageUrl, id) {
        this._id = id ? new mongodb_1.ObjectId(id) : undefined;
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                return yield db.collection("products").insertOne(this);
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
    static fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                return yield db.collection("products").find().toArray();
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
    static findById(prodId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Transforming prodId to type ObjectId
            const id = new mongodb_1.ObjectId(prodId);
            try {
                const db = (0, database_1.getDb)();
                return yield db.collection("products").findOne({ _id: id });
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
    static update(prodId, updatedProd) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = (0, database_1.getDb)();
            const id = new mongodb_1.ObjectId(prodId);
            try {
                return yield db
                    .collection("products")
                    .updateOne({ _id: id }, { $set: updatedProd });
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
    static deleteById(prodId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                const id = new mongodb_1.ObjectId(prodId);
                return yield db.collection("products").deleteOne({ _id: id });
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
}
exports.Product = Product;
