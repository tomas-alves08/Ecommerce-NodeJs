"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = deleteFile;
const fs_1 = __importDefault(require("fs"));
function deleteFile(filePath) {
    fs_1.default.unlink("src/" + filePath, (err) => {
        if (err)
            throw err;
    });
}
