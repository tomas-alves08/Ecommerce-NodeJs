"use strict";
// require("dotenv").config();
// const { Pool } = require("pg");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = void 0;
// // Create a new client instance
// const pool = new Pool({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
// });
// export default pool;
// import { Sequelize } from "sequelize-typescript";
// import { Product } from "../models/product";
// import { User } from "../models/user";
// import { CartItem } from "../models/cart-item";
// import { Cart } from "../models/cart";
// import { Order } from "../models/order";
// import { OrderItem } from "../models/order-item";
// const sequelize = new Sequelize({
//   dialect: "postgres",
//   host: process.env.PGHOST,
//   username: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   database: "node-course",
//   models: [Product, User, Cart, CartItem, Order, OrderItem], // Pass your models here
// });
// export default sequelize;
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
let _db;
const mongoConnect = (callback) => {
    const uri = process.env.MONGODB_URI || "";
    mongodb_1.MongoClient.connect(uri)
        .then((client) => {
        console.log("Connected to MongoDB");
        _db = client.db();
        callback();
    })
        .catch((err) => {
        console.log(err);
        throw err;
    });
};
const getDb = () => {
    if (_db) {
        return _db;
    }
    throw new Error("No database found!");
};
exports.getDb = getDb;
exports.default = mongoConnect;
