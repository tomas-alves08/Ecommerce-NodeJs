import { Request, Response } from "express";

export function getNotFound(req: Request, res: Response, next: Function) {
  res
    .status(404)
    .render("404", { pageTitle: "Page Not Found", path: req.path });
}
