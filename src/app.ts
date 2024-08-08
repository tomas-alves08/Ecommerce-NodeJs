import express from "express";
import { Request, Response, NextFunction, Express } from "express";
import path from "path";
import fs from "fs";
import bodyParser from "body-parser";
import multer, { Multer } from "multer";
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

// Setting up how the file is stored
const imagesDir = path.join(__dirname, "src/images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  )
    cb(null, true);
  else cb(null, false);
};

app.use(bodyParser.urlencoded({ extended: false }));
// Middleware to allow my form to get file that are uploaded
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
console.log(__dirname);
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

app.use((req: Request, res: Response, next: NextFunction) => {
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
  console.log(error);
  const errorMessage = error.toString().split(":")[1];
  console.log("REQ SESSION: ", req.session);
  // res.redirect("/500");
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: (req.session as SessionCustom).isLoggedIn,
    errorMessage,
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
