"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controllers/admin");
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get("/add-product", is_auth_1.default, admin_1.getAddProduct);
router.get("/products", is_auth_1.default, admin_1.getProducts);
router.post("/add-product", is_auth_1.default, [
    (0, express_validator_1.check)("title")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Title must contain only alpha numeric values and at least 3 characters long.")
        .trim(),
    (0, express_validator_1.check)("price").isNumeric().withMessage("Price is required."),
    (0, express_validator_1.check)("description")
        .isString()
        .isLength({ min: 5, max: 400 })
        .withMessage("Description must contain only alpha numeric values and at least 5 characters long.")
        .trim(),
], admin_1.postAddProduct);
router.get("/edit-product/:productId", is_auth_1.default, admin_1.getEditProduct);
router.post("/edit-product", is_auth_1.default, [
    (0, express_validator_1.check)("title")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Title must contain only alpha numeric values and at least 3 characters long.")
        .trim(),
    // check("imageUrl")
    //   .isURL()
    //   .withMessage("Please enter a valid URL in the image field.")
    //   .trim(),
    (0, express_validator_1.check)("price").isNumeric().withMessage("Price is required."),
    (0, express_validator_1.check)("description")
        .isString()
        .isLength({ min: 5, max: 400 })
        .withMessage("Description must contain only alpha numeric values and at least 5 characters long.")
        .trim(),
], admin_1.postEditProduct);
router.post("/delete-product/:productId", is_auth_1.default, admin_1.postDeleteProduct);
exports.default = router;
