"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotFound = getNotFound;
exports.get500DatabaseFailed = get500DatabaseFailed;
function getNotFound(req, res, next) {
    res.status(404).render("404", {
        pageTitle: "Page Not Found",
        path: req.path,
        isAuthenticated: req.session.isLoggedIn,
    });
}
function get500DatabaseFailed(req, res, next) {
    res.status(500).render("500", {
        pageTitle: "Error!",
        path: "/500",
        isAuthenticated: req.session.isLoggedIn,
    });
}
