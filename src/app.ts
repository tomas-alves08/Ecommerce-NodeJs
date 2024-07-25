import express from "express";
import { Request, Response, NextFunction } from "express";
import path from "path";
import sequelize from "./util/database";

import bodyParser from "body-parser";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");

import adminRoute from "./routes/admin";
import shopRoute from "./routes/shop";
import { getNotFound } from "./controllers/error";
import { IUser } from "./util/schemas";

import { User } from "./models/user";
import { Product } from "./models/product";
import { Cart } from "./models/cart";
import { CartItem } from "./models/cart-item";
import { Order } from "./models/order";
import { OrderItem } from "./models/order-item";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoute);
app.use(shopRoute);

// Set a route for a NOT FOUND page
app.use("/", getNotFound);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
Order.belongsToMany(Product, { through: OrderItem });

export let userId: string = "";

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    return User.findOne();
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Tomas", email: "t@m.com" } as any);
    }
    return user;
  })
  .then((user) => {
    userId = user?.id || "";
    // const cart = user.createCart();
    // console.log("CART 1: ", cart);
    // return { cart, user };
    app.listen(3000);
  })
  .catch((err: any) => {
    console.log(err);
  });
