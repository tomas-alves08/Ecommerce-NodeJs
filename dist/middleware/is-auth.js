"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAuth = (req, res, next) => {
    console.log("isAuth middleware called!", req.session);
    if (!req.session.isLoggedIn)
        return res.redirect("/login");
    next();
};
exports.default = isAuth;
