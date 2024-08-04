import { Response, Request } from "express";
import { SessionCustom } from "../util/schemas";
import User from "../models/user";

export async function getLogin(req: Request, res: Response, next: Function) {
  //   const isLoggedIn = req.get("Cookie")?.split(";")[1].trim().split("=")[1];
  console.log((req.session as SessionCustom).isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
}

export async function postLogin(req: Request, res: Response, next: Function) {
  try {
    const user = await User.findById("66ab2bcf73546beb137d6da3");
    (req.session as SessionCustom).user = user;
    (req.session as SessionCustom).isLoggedIn = true;

    (req.session as SessionCustom).save((err) => {
      res.redirect("/");
    });
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function postLogout(req: Request, res: Response, next: Function) {
  try {
    await (req.session as SessionCustom).destroy((err) => {
      console.log(err);
      res.redirect("/login");
    });
  } catch (err: any) {
    console.log(err.message);
  }
}
