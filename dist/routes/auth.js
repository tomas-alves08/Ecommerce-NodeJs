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
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const router = express_1.default.Router();
router.get("/signup", auth_1.getSignup);
router.post("/signup", [
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req }) {
        const existingUser = yield user_1.default.findOne({ email: req.body.email });
        console.log("Validation email: ", existingUser);
        if (existingUser) {
            req.flash("error", "Email already exists.");
            return Promise.reject("E-mail already exists, please choose a different one.");
        }
        return true;
    }))
        .toLowerCase()
        .trim(),
    (0, express_validator_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("Password minimum length is 6.")
        .trim(),
    (0, express_validator_1.check)("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password)
            throw new Error("Confirm password must match password");
        return true;
    }),
], auth_1.postSignup);
router.get("/login", auth_1.getLogin);
router.post("/login", [
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("Please enter a valid email!")
        .toLowerCase()
        .trim(),
    (0, express_validator_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("Password minimum length is 6.")
        .trim(),
], auth_1.postLogin);
router.post("/logout", auth_1.postLogout);
router.get("/reset", auth_1.getReset);
router.post("/reset", auth_1.postReset);
router.get("/reset/:token", auth_1.getNewPassword);
router.post("/new-password", auth_1.postNewPassword);
exports.default = router;
