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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const csurf_1 = __importDefault(require("csurf"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Setting up the Session Store
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI || "",
    collection: "sessions",
});
const csrfProtection = (0, csurf_1.default)();
// import mongoConnect from "./util/database";
const user_1 = __importDefault(require("./models/user"));
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", "./src/views");
const admin_1 = __importDefault(require("./routes/admin"));
const shop_1 = __importDefault(require("./routes/shop"));
const auth_1 = __importDefault(require("./routes/auth"));
const error_1 = require("./controllers/error");
// Setting up how the file is stored
const imagesDir = path_1.default.join(__dirname, "src/images");
if (!fs_1.default.existsSync(imagesDir)) {
    fs_1.default.mkdirSync(imagesDir, { recursive: true });
}
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg")
        cb(null, true);
    else
        cb(null, false);
};
app.use(body_parser_1.default.urlencoded({ extended: false }));
// Middleware to allow my form to get file that are uploaded
app.use((0, multer_1.default)({ storage: fileStorage, fileFilter }).single("image"));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "images")));
console.log(__dirname);
// Setting up the Session
app.use((0, express_session_1.default)({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
}));
//Add Cross Site Request Forgery Protection
app.use(csrfProtection);
app.use((0, connect_flash_1.default)());
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
// Setting up an User Instance for each request
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.session.user)
        return next();
    try {
        const user = yield user_1.default.findById((_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user)
            return next();
        req.user = user;
        next();
    }
    catch (err) {
        // throw new Error(err);
        next(new Error(err));
    }
}));
app.use("/admin", admin_1.default);
app.use(shop_1.default);
app.use(auth_1.default);
app.get("/500", error_1.get500DatabaseFailed);
// Set a route for a NOT FOUND page
app.use("/", error_1.getNotFound);
app.use((error, req, res, next) => {
    console.log(error);
    const errorMessage = error.toString().split(":")[1];
    console.log("REQ SESSION: ", req.session);
    // res.redirect("/500");
    res.status(500).render("500", {
        pageTitle: "Error!",
        path: "/500",
        isAuthenticated: req.session.isLoggedIn,
        errorMessage,
    });
});
mongoose_1.default
    .connect(process.env.MONGODB_URI || "")
    .then(() => {
    app.listen(3000);
})
    .catch((err) => {
    console.log(err.message);
});
