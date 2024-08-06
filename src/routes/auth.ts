import express from "express";
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
import { check } from "express-validator";
import User from "../models/user";

const router = express.Router();

router.get("/signup", getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value, { req }) => {
        const existingUser = await User.findOne({ email: req.body.email });
        console.log("Validation email: ", existingUser);
        if (existingUser) {
          req.flash("error", "Email already exists.");
          return Promise.reject(
            "E-mail already exists, please choose a different one."
          );
        }
        return true;
      })
      .toLowerCase()
      .trim(),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password minimum length is 6.")
      .trim(),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password)
        return Promise.reject("Confirm password must match password");
      return true;
    }),
  ],
  postSignup
);

router.get("/login", getLogin);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email!")
      .toLowerCase()
      .trim(),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password minimum length is 6.")
      .trim(),
  ],
  postLogin
);

router.post("/logout", postLogout);

router.get("/reset", getReset);

router.post("/reset", postReset);

router.get("/reset/:token", getNewPassword);

router.post("/new-password", postNewPassword);

export default router;
