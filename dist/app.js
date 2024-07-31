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
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = __importDefault(require("./util/database"));
const user_1 = require("./models/user");
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", "./src/views");
const admin_1 = __importDefault(require("./routes/admin"));
const shop_1 = __importDefault(require("./routes/shop"));
const error_1 = require("./controllers/error");
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findById("66a93c073d6d383367f31122");
    req.user = user;
    next();
}));
app.use("/admin", admin_1.default);
app.use(shop_1.default);
// Set a route for a NOT FOUND page
app.use("/", error_1.getNotFound);
(0, database_1.default)(() => {
    app.listen(3000);
});
