"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotFound = getNotFound;
function getNotFound(req, res, next) {
    res
        .status(404)
        .render("404", { pageTitle: "Page Not Found", path: req.path });
}
