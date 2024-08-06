import express, { NextFunction, Response, Request } from "express";
import {
  getLogin,
  getNewPassword,
  getReset,
  getSignup,
  postLogin,
  postLogout,
  postNewPassword,
  postReset,
  postSignup,
} from "../controllers/auth";

const router = express.Router();

router.get("/signup", getSignup);

router.post("/signup", postSignup);

router.get("/login", getLogin);

router.post("/login", postLogin);

router.post("/logout", postLogout);

router.get("/reset", getReset);

router.post("/reset", postReset);

router.get("/reset/:token", getNewPassword);

router.post("/new-password", postNewPassword);

export default router;
