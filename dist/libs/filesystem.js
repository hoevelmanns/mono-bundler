"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileSystem = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const fs_extra_2 = require("fs-extra");
class FileSystem {
    static concat(filename, str) {
        if (str.length === 0) {
            return filename;
        }
        const outputExtension = path_1.default.extname(filename);
        return filename.replace(outputExtension, `.${str}${outputExtension}`);
    }
}
FileSystem.dirname = (file) => path_1.default.dirname(file);
FileSystem.copySync = (src, dest, opts) => fs_extra_1.default.copySync(src, dest, opts);
FileSystem.existsSync = (file) => fs_extra_1.default.existsSync(file);
FileSystem.join = (...paths) => path_1.default.join(...paths);
FileSystem.outputFileSync = (dest, content) => fs_extra_2.outputFileSync(dest, content);
FileSystem.resolve = (...pathSegments) => path_1.default.resolve(...pathSegments);
FileSystem.filename = (path) => path.split("/").pop();
FileSystem.extname = (p) => path_1.default.extname(p);
exports.fileSystem = FileSystem;
