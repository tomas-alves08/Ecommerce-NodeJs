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
exports.getProduct = getProduct;
exports.getIndex = getIndex;
exports.getCart = getCart;
exports.postCart = postCart;
exports.postCartDeleteProduct = postCartDeleteProduct;
exports.getOrders = getOrders;
exports.postOrder = postOrder;
exports.GetInvoice = GetInvoice;
const product_1 = __importDefault(require("../models/product"));
const order_1 = __importDefault(require("../models/order"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const ITEMS_PER_PAGE = 1;
function getProducts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = Number(req.query.page) || 1;
        try {
            const totalItems = yield product_1.default.find().countDocuments();
            const products = yield product_1.default.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
            console.log("products: ", products);
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "Products",
                path: "/products",
                currentPage: page,
                hasNextPage: totalItems > page * ITEMS_PER_PAGE,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            });
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    });
}
function getProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const prodId = req.params.productId;
        // console.log(
        try {
            const product = yield product_1.default.findById(prodId);
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product === null || product === void 0 ? void 0 : product.title,
                path: `/products`,
                // isAuthenticated: (req.session as SessionCustom).isLoggedIn,
            });
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
        // );
    });
}
function getIndex(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = Number(req.query.page) || 1;
            const totalItems = yield product_1.default.find().countDocuments();
            const products = yield product_1.default.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
            console.log("products: ", products);
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
                currentPage: page,
                hasNextPage: totalItems > page * ITEMS_PER_PAGE,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            });
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    });
}
function getCart(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const user = yield ((_a = req.user) === null || _a === void 0 ? void 0 : _a.populate("cart.items.productId"));
            const cartProducts = user === null || user === void 0 ? void 0 : user.cart.items;
            console.log(cartProducts);
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                products: cartProducts,
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
function postCart(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const productId = req.body.productId || "";
            const product = yield product_1.default.findById(productId);
            if (product) {
                const user = yield ((_a = req.user) === null || _a === void 0 ? void 0 : _a.addToCart(product));
                console.log("User: ", user);
                res.redirect("/cart");
            }
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    });
}
function postCartDeleteProduct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            yield ((_a = req.user) === null || _a === void 0 ? void 0 : _a.removeFromCart(req.body.productId));
            res.redirect("/cart");
        }
        catch (err) {
            console.log(err.message);
        }
    });
}
function getOrders(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const orders = yield order_1.default.find({
                "user.userId": (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            });
            console.log(orders);
            res.render("shop/orders", {
                path: "/orders",
                pageTitle: "Your Orders",
                orders,
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
function postOrder(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const user = yield ((_a = req.user) === null || _a === void 0 ? void 0 : _a.populate("cart.items.productId"));
            const cartProducts = user === null || user === void 0 ? void 0 : user.cart.items.map((item) => {
                return {
                    quantity: item.quantity,
                    productData: Object.assign({}, item.productId.toObject()),
                };
            });
            const order = new order_1.default({
                user: {
                    email: (_b = req.user) === null || _b === void 0 ? void 0 : _b.email,
                    userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
                },
                products: cartProducts,
            });
            yield order.save();
            // Clear the user's cart
            yield ((_d = req.user) === null || _d === void 0 ? void 0 : _d.clearCart());
            res.redirect("/orders");
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    });
}
function GetInvoice(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const orderId = req.params.orderId;
        try {
            const order = (yield order_1.default.findById(orderId));
            if (!order)
                return next("No order found.");
            const user = req.user;
            if (((_a = order === null || order === void 0 ? void 0 : order.user) === null || _a === void 0 ? void 0 : _a.userId.toString()) !== (user === null || user === void 0 ? void 0 : user._id.toString()))
                return next(new Error("You are not authorized to see this file."));
            const invoiceName = "invoice-" + orderId + ".pdf";
            const invoicePath = path_1.default.join("src", "data", "invoices", invoiceName);
            const pdfDocument = new pdfkit_1.default();
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "inline; filename='" + invoiceName + "'");
            pdfDocument.pipe(fs_1.default.createWriteStream(invoicePath));
            pdfDocument.pipe(res);
            pdfDocument.fontSize(26).text("Invoice", {
                underline: true,
            });
            pdfDocument.text("------------------------------");
            let totalPrice = 0;
            order.products.forEach((prod) => {
                totalPrice += prod.productData.price * prod.quantity;
                pdfDocument.fontSize(20).text(prod.productData.title);
                pdfDocument
                    .fontSize(14)
                    .text("Price: $" + prod.productData.price + " | Quantity: " + prod.quantity);
                pdfDocument
                    .fontSize(14)
                    .text("Description: $" + prod.productData.description);
                pdfDocument.text("--------");
            });
            pdfDocument.fontSize(18).text("Total: " + totalPrice);
            pdfDocument.end();
            // fs.readFile(invoicePath, (err, data) => {
            //   console.log(err);
            //   if (err) return next(err);
            //   res.setHeader("Content-Type", "application/pdf");
            //   res.setHeader(
            //     "Content-Disposition",
            //     "inline; filename='" + invoiceName + "'"
            //   );
            //   res.send(data);
            // });
            // // HOW TO PIPE LARGE PDF FILES
            // const file = fs.createReadStream(invoicePath);
            // res.setHeader("Content-Type", "application/pdf");
            //   res.setHeader(
            //     "Content-Disposition",
            //     "inline; filename='" + invoiceName + "'"
            //   );
            // file.pipe(res);
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    });
}
