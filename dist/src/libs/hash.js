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
exports.Hash = void 0;
const folder_hash_1 = require("folder-hash");
class Hash {
    /**
     *
     * @param {string} input
     */
    constructor(input) {
        this.input = input;
        this.hash = '';
    }
    /**
     * @todo description
     * @returns {string}
     */
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.generate();
            return this.hash;
        });
    }
    /**
     * @returns {Promise<string>}
     */
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hash)
                return this.hash;
            this.hash = (yield folder_hash_1.hashElement(this.input)).hash
                .toString()
                .replace(/[^a-z0-9]/gi, '')
                .slice(0, 16)
                .toLowerCase();
            return this.hash;
        });
    }
}
exports.Hash = Hash;
//# sourceMappingURL=hash.js.map