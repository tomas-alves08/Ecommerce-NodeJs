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
exports.getSignup = getSignup;
exports.postSignup = postSignup;
exports.getLogin = getLogin;
exports.postLogin = postLogin;
exports.postLogout = postLogout;
exports.getReset = getReset;
exports.postReset = postReset;
exports.getNewPassword = getNewPassword;
exports.postNewPassword = postNewPassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Crypto library provided by NodeJs
const crypto_1 = __importDefault(require("crypto"));
const user_1 = __importDefault(require("../models/user"));
const mail_1 = __importDefault(require("../util/mail"));
const express_validator_1 = require("express-validator");
function getSignup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = req.flash("error");
        let errorMessage;
        if (message.length)
            errorMessage = message[0];
        else
            errorMessage = null;
        res.render("auth/signup", {
            path: "/signup",
            pageTitle: "Signup",
            errorMessage,
            oldInput: { email: "", password: "", confirmPassword: "" },
        });
    });
}
function postSignup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        //Validation
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).render("auth/signup", {
                path: "/signup",
                pageTitle: "Signup",
                errorMessage: errors.array()[0].msg,
                oldInput: { email, password, confirmPassword: req.body.confirmPassword },
            });
        }
        try {
            // Encrypting the password
            const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
            const user = new user_1.default({
                email,
                password: hashedPassword,
                cart: { items: [] },
            });
            yield user.save();
            res.redirect("/login");
            //Send email
            return yield (0, mail_1.default)(email, "User created successfully", `<p>Signup of user ${email} done successfully!</p>`);
        }
        catch (err) {
            console.log(err.message);
        }
    });
}
function getLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = req.flash("error");
        let errorMessage;
        if (message.length)
            errorMessage = message[0];
        else
            errorMessage = null;
        res.render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage,
            oldInput: { email: "", password: "" },
        });
    });
}
function postLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        //Validation
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).render("auth/login", {
                path: "/login",
                pageTitle: "Login",
                errorMessage: errors.array()[0].msg,
                oldInput: { email, password },
            });
        }
        try {
            const user = yield user_1.default.findOne({ email: email });
            console.log("Login user: ", user);
            if (!user) {
                return res.status(422).render("auth/login", {
                    path: "/login",
                    pageTitle: "Login",
                    errorMessage: "Invalid email or password",
                    oldInput: {
                        email,
                        password,
                    },
                });
            }
            else {
                try {
                    const doMatch = yield bcryptjs_1.default.compare(password, user.password);
                    if (doMatch) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        return req.session.save((err) => {
                            res.redirect("/");
                        });
                    }
                    res.redirect("/login");
                }
                catch (err) {
                    res.redirect("/login");
                }
            }
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    });
}
function postLogout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield req.session.destroy((err) => {
                console.log(err);
                res.redirect("/login");
            });
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    });
}
function getReset(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = req.flash("error");
        let errorMessage;
        if (message.length)
            errorMessage = message[0];
        else
            errorMessage = null;
        res.render("auth/reset", {
            path: "/reset",
            pageTitle: "Reset Password",
            errorMessage,
        });
    });
}
function postReset(req, res, next) {
    crypto_1.default.randomBytes(32, (err, buffer) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.redirect("/reset");
        }
        const token = buffer.toString("hex");
        try {
            const user = yield user_1.default.findOne({ email: req.body.email });
            if (user) {
                user.resetToken = token;
                user.resetTokenExpiration = new Date(Date.now() + 3600000);
                yield user.save();
                res.redirect("/");
                return yield (0, mail_1.default)(req.body.email, "Reset user password", `<p>Please ignore this e-mail if you haven't requested a password reset.</p>
          <p>Click this <a href='http://localhost:3000/reset/${token}'>Link</a> to set a new password</p>`);
            }
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
        req.flash("error", "No user matches this e-mail address.");
        res.redirect("/reset");
    }));
}
function getNewPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = req.flash("error");
        let errorMessage;
        if (message.length)
            errorMessage = message[0];
        else
            errorMessage = null;
        const user = yield user_1.default.findOne({
            resetToken: req.params.token,
            resetTokenExpiration: { $gt: Date.now() },
        });
        if (user) {
            res.render("auth/new-password", {
                path: "auth/new-password",
                pageTitle: "New Password",
                errorMessage,
                userId: user._id.toString(),
                token: req.params.token,
            });
        }
        else {
            req.flash("error", "No user has thie reset token.");
            res.redirect("/reset");
        }
    });
}
function postNewPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const newPassword = req.body.password;
        const userId = req.body.userId;
        const passwordToken = req.body.passwordToken;
        try {
            const user = yield user_1.default.findOne({
                _id: userId,
                resetToken: passwordToken,
                resetTokenExpiration: { $gt: Date.now() },
            });
            if (user) {
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 12);
                user.password = hashedPassword;
                user.resetToken = undefined;
                user.resetTokenExpiration = undefined;
                yield user.save();
                return res.redirect("/login");
            }
        }
        catch (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
    });
}
