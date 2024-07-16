import express from "express";
import path from "path";

import bodyParser from "body-parser";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");

import adminRoute from "./routes/admin";
import shopRoute from "./routes/shop";
import { getNotFound } from "./controllers/error";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoute);
app.use(shopRoute);

// Set a route for a NOT FOUND page
app.use("/", getNotFound);

app.listen(3000);
