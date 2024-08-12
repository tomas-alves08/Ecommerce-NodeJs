"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getEditProduct = getEditProduct;
exports.postEditProduct = postEditProduct;
exports.postDeleteProduct = postDeleteProduct;
const product_1 = __importDefault(require("../models/product"));
const express_validator_1 = require("express-validator");
const file_1 = require("../util/file");
function getProducts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const products = yield product_1.default.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
            console.log("products: ", products);
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
                // isAuthenticated: (req.session as SessionCustom).isLoggedIn,
            });
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    });
}
function getAddProduct(req, res, next) {
    // if (!(req.session as SessionCustom).isLoggedIn) return res.redirect("/login");
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        hasError: false,
        errorMessage: null,
        oldInput: { title: "", imageUrl: "", description: "", price: "" },
    });
}
function postAddProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, description, price } = req.body;
        console.log("Post Product Body: ", req.body);
        const image = req.file;
        console.log("IMAGE: ", image);
        if (!image) {
            return res.status(422).render("admin/edit-product", {
                pageTitle: "Add Product",
                path: "/admin/add-product",
                editing: false,
                hasError: true,
                errorMessage: "Attached file is not an image",
                product: { title, description, price },
            });
        }
        // Validation
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).render("admin/edit-product", {
                pageTitle: "Add Product",
                path: "/admin/add-product",
                editing: false,
                hasError: true,
                errorMessage: errors.array()[0].msg,
                product: { title, image, description, price },
            });
        }
        const imageUrl = "images/" + image.filename;
        try {
            const product = yield new product_1.default({
                title,
                price,
                description,
                imageUrl,
                userId: req.user,
            });
            yield product.save();
            console.log("created a product");
            res.redirect("/");
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    });
}
function getEditProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const editMode = req.query.edit;
        if (!editMode) {
            return res.redirect("/");
        }
        const prodId = req.params.productId;
        try {
            const product = yield product_1.default.findById(prodId);
            if (!product) {
                return res.redirect("/");
            }
            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product,
                hasError: false,
                errorMessage: null,
                // isAuthenticated: (req.session as SessionCustom).isLoggedIn,
            });
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    });
}
function postEditProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const prodId = req.body.productId;
        const { title, description, price } = req.body;
        const image = req.file;
        // Validation
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: true,
                hasError: true,
                errorMessage: errors.array()[0].msg,
                product: { title, description, price },
            });
        }
        try {
            const product = yield product_1.default.findById(prodId);
            if ((product === null || product === void 0 ? void 0 : product.userId).toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()))
                return res.redirect("/");
            if (product) {
                product.title = title;
                product.description = description;
                if (image) {
                    (0, file_1.deleteFile)(product.imageUrl);
                    product.imageUrl = image.path;
                }
                product.price = price;
                yield product.save();
                res.redirect("/admin/products");
            }
            else
                res.redirect("/");
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    });
}
function postDeleteProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const prodId = req.params.productId;
        try {
            const product = yield product_1.default.findById(prodId);
            if (!product)
                return next(new Error("No product found."));
            else
                (0, file_1.deleteFile)(product.imageUrl);
            yield product_1.default.deleteOne({ _id: prodId, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
            res.redirect("/admin/products");
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    });
}
