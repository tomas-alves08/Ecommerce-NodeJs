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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getEditProduct = getEditProduct;
exports.postEditProduct = postEditProduct;
exports.postDeleteProduct = postDeleteProduct;
const product_1 = require("../models/product");
// import { IProduct } from "../util/schemas";
// import { User } from "../models/user";
// import { userId } from "../app";
function getProducts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const user = await User.findByPk(userId);
            const products = yield product_1.Product.fetchAll();
            console.log("products: ", products);
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            });
        }
        catch (err) {
            console.log(err.message);
        }
    });
}
function getAddProduct(req, res, next) {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
}
function postAddProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, imageUrl, description, price } = req.body;
        try {
            // const user = await User.findByPk("4c844722-2dbd-4232-93c3-d07c4a34eb0a");
            // console.log("user", user);
            // if (user) {
            const product = yield new product_1.Product(title, price, description, imageUrl);
            product.save();
            console.log("created a product");
            res.redirect("/");
            // }
        }
        catch (err) {
            console.log(err);
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
            const product = yield product_1.Product.findById(prodId);
            if (!product) {
                return res.redirect("/");
            }
            res.render("admin/edit-product", {
                pageTitle: "Add Product",
                path: "/admin/edit-product",
                editing: editMode,
                product,
            });
        }
        catch (err) {
            console.log(err.message);
        }
    });
}
function postEditProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const prodId = req.body.productId;
        const { title, imageUrl, description, price } = req.body;
        try {
            // const product = await Product.findById(prodId);
            // if (product) {
            const product = {
                title,
                imageUrl,
                description,
                price,
            };
            // product.title = title;
            // product.imageUrl = imageUrl;
            // product.description = description;
            // product.price = price;
            const prod = yield product_1.Product.update(prodId, product);
            if (prod)
                res.redirect("/admin/products");
            else
                res.redirect("/");
        }
        catch (err) {
            console.log(err.message);
        }
    });
}
function postDeleteProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const prodId = req.params.productId;
        console.log(prodId);
        try {
            // const product = await Product.findById(prodId);
            // if (product) {
            yield product_1.Product.deleteById(prodId);
            res.redirect("/admin/products");
            // }
        }
        catch (err) {
            console.log(err.message);
        }
    });
}
