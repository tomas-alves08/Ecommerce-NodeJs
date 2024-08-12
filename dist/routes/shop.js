"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shop_1 = require("../controllers/shop");
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const router = (0, express_1.Router)();
router.get("/", shop_1.getIndex);
router.get("/products", shop_1.getProducts);
router.get("/products/:productId", shop_1.getProduct);
router.get("/cart", is_auth_1.default, shop_1.getCart);
router.post("/cart", is_auth_1.default, shop_1.postCart);
router.post("/cart-delete-item", is_auth_1.default, shop_1.postCartDeleteProduct);
router.get("/orders", is_auth_1.default, shop_1.getOrders);
router.post("/create-order", is_auth_1.default, shop_1.postOrder);
router.get("/orders/:orderId", is_auth_1.default, shop_1.GetInvoice);
exports.default = router;
