// require("dotenv").config();
// const { Pool } = require("pg");

// // Create a new client instance
// const pool = new Pool({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
// });

// export default pool;

import { Sequelize } from "sequelize-typescript";
import { Product } from "../models/product";
import { User } from "../models/user";
import { CartItem } from "../models/cart-item";
import { Cart } from "../models/cart";
import { Order } from "../models/order";
import { OrderItem } from "../models/order-item";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.PGHOST,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: "node-course",
  models: [Product, User, Cart, CartItem, Order, OrderItem], // Pass your models here
});

export default sequelize;
