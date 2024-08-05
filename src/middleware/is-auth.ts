import { Request, Response, NextFunction } from "express";
import { SessionCustom } from "../util/schemas";

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!(req.session as SessionCustom).isLoggedIn) return res.redirect("/login");
  next();
};

export default isAuth;
