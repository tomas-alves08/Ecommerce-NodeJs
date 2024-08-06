import express from "express";
import { Request, Response, NextFunction } from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import connectMongodbSession from "connect-mongodb-session";
import csrf from "csurf";
import flash from "connect-flash";
import dotenv from "dotenv";

dotenv.config();

// Setting up the Session Store
const MongoDBStore = connectMongodbSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI || "",
  collection: "sessions",
});
const csrfProtection = csrf();

// import mongoConnect from "./util/database";
import User from "./models/user";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");

import adminRoute from "./routes/admin";
import shopRoute from "./routes/shop";
import authRoute from "./routes/auth";
import { get500DatabaseFailed, getNotFound } from "./controllers/error";
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

//Add Cross Site Request Forgery Protection
app.use(csrfProtection);
app.use(flash());

app.use((req: RequestCustom, res: Response, next: NextFunction) => {
  res.locals.isAuthenticated = (req.session as SessionCustom).isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Setting up an User Instance for each request
app.use(async (req: RequestCustom, res: Response, next: NextFunction) => {
  if (!(req.session as SessionCustom).user) return next();
  try {
    const user = await User.findById((req.session as SessionCustom).user?._id);
    if (!user) return next();
    req.user = user;
    next();
  } catch (err: any) {
    // throw new Error(err);
    next(new Error(err));
  }
});

app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);

app.get("/500", get500DatabaseFailed);

// Set a route for a NOT FOUND page
app.use("/", getNotFound);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("ERROR MIDDLEWARE!");
  // res.redirect("/500");
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: (req.session as SessionCustom).isLoggedIn,
  });
});

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => {
    app.listen(3000);
  })
  .catch((err: any) => {
    console.log(err.message);
  });
