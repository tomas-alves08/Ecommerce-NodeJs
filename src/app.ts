import express from "express";
import { Response, NextFunction } from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import connectMongodbSession from "connect-mongodb-session";
import dotenv from "dotenv";

dotenv.config();

// Setting up the Session Store
const MongoDBStore = connectMongodbSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI || "",
  collection: "sessions",
});

// import mongoConnect from "./util/database";
import User from "./models/user";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");

import adminRoute from "./routes/admin";
import shopRoute from "./routes/shop";
import authRoute from "./routes/auth";
import { getNotFound } from "./controllers/error";
import { RequestCustom, SessionCustom } from "./util/schemas";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Setting up the Session
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// Setting up an User Instance for each request
app.use(async (req: RequestCustom, res: Response, next: NextFunction) => {
  if (!(req.session as SessionCustom).user) return next();

  const user = await User.findById((req.session as SessionCustom).user?._id);
  req.user = user;
  next();
});

app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);

// Set a route for a NOT FOUND page
app.use("/", getNotFound);

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Tomas Alves de Souza",
          email: "tomas@mail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err: any) => {
    console.log(err.message);
  });
