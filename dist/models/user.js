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
exports.User = void 0;
const mongodb_1 = require("mongodb");
const database_1 = require("../util/database");
class User {
    constructor(username, email) {
        this.name = "";
        this.email = "";
        this.name = username;
        this.email = email;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                return yield db.collection("users").insertOne(this);
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
    static findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                const id = new mongodb_1.ObjectId(userId);
                const user = yield db.collection("users").findOne({ _id: id });
                return user ? Object.assign(new User(user.name, user.email), user) : null;
            }
            catch (err) {
                console.log(err.message);
            }
        });
    }
}
exports.User = User;
