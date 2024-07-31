import express from "express";
import { Request, Response, NextFunction } from "express";
import path from "path";

import bodyParser from "body-parser";

import mongoConnect from "./util/database";
import { User } from "./models/user";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");

import adminRoute from "./routes/admin";
import shopRoute from "./routes/shop";
import { getNotFound } from "./controllers/error";
import { ICart, IUser, RequestCustom } from "./util/schemas";
import { ObjectId } from "mongodb";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req: RequestCustom, res: Response, next: NextFunction) => {
  const user = await User.findById("66aa1b633d6d383367f3112a");
  req.user = new User(
    user?.name || "",
    user?.email || "",
    user?.cart || { items: [] },
    user?._id.toString() || ""
  );
  next();
});

app.use("/admin", adminRoute);
app.use(shopRoute);

// Set a route for a NOT FOUND page
app.use("/", getNotFound);

mongoConnect(() => {
  app.listen(3000);
});
