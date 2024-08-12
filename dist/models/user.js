"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = mongoose_1.default.Schema;
const userSchema = new UserSchema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [
            {
                productId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
});
userSchema.methods.addToCart = function (product) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const cartProductIndex = (_b = (_a = this.cart) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.findIndex((prod) => { var _a; return prod.productId.toString() === ((_a = product._id) === null || _a === void 0 ? void 0 : _a.toString()); });
        const updatedCartItems = [...this.cart.items];
        if (cartProductIndex >= 0) {
            const newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        }
        else {
            updatedCartItems.push({
                productId: product._id,
                quantity: 1,
            });
        }
        const updatedCart = {
            items: updatedCartItems,
        };
        try {
            this.cart = updatedCart;
            return yield this.save();
        }
        catch (err) {
            console.log(err.message);
        }
    });
};
userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter((item) => item.productId.toString() !== productId.toString());
    this.cart.items = updatedCartItems;
    return this.save();
};
userSchema.methods.clearCart = function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.cart = { items: [] };
        return yield this.save();
    });
};
module.exports = mongoose_1.default.model("User", userSchema);
