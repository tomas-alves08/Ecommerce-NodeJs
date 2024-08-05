import express, { NextFunction, Response, Request } from "express";
import {
  getLogin,
  getSignup,
  postLogin,
  postLogout,
  postSignup,
} from "../controllers/auth";

const router = express.Router();

router.get("/signup", getSignup);

router.post("/signup", postSignup);

router.get("/login", getLogin);

router.post("/login", postLogin);

router.post("/logout", postLogout);

export default router;
