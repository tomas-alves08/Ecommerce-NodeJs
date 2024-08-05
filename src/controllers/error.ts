import { Response } from "express";
import { RequestCustom, SessionCustom } from "../util/schemas";

export function getNotFound(req: RequestCustom, res: Response, next: Function) {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: req.path,
    // isAuthenticated: (req.session as SessionCustom).isLoggedIn,
  });
}
