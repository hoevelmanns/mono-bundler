"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_symbols_1 = __importDefault(require("log-symbols"));
const chalk_1 = __importDefault(require("chalk"));
const errorTxt = chalk_1.default.red;
const yellowTxt = chalk_1.default.yellow;
const warningTxt = chalk_1.default.keyword('orange');
const successTxt = chalk_1.default.green;
const infoTxt = chalk_1.default.cyan;
const iconError = log_symbols_1.default.error;
const iconSuccess = log_symbols_1.default.success;
class Logger {
    constructor(silent) {
        this.silent = silent;
        const args = require('minimist')(process.argv.slice(2));
        this.silent = silent !== null && silent !== void 0 ? silent : args === null || args === void 0 ? void 0 : args.silent;
    }
    /**
     * @param {string} message
     * @returns void
     */
    info(message) {
        console.log(infoTxt(message));
    }
    /**
     * @param {string} message
     * @returns void
     */
    default(message) {
        console.log(message);
    }
    /**
     * @param {string} message
     * @returns void
     */
    success(message) {
        console.log(`${iconSuccess} ${successTxt(message)}`);
    }
    /**
     * @param {string} message
     * @returns void
     */
    error(message) {
        console.log(`${iconError} ${errorTxt(message)}`);
    }
    /**
     * @param {string} message
     * @returns void
     */
    warn(message) {
        !this.silent && console.log(`${warningTxt(message)}`);
    }
    /**
     * @param {string} message
     * @returns void
     */
    yellow(message) {
        console.log(yellowTxt(message));
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map