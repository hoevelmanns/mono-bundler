"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const log_symbols_1 = __importDefault(require("log-symbols"));
const chalk_1 = __importDefault(require("chalk"));
const tsyringe_1 = require("tsyringe");
const errorTxt = chalk_1.default.red;
const yellowTxt = chalk_1.default.yellow;
const warningTxt = chalk_1.default.keyword('orange');
const successTxt = chalk_1.default.green;
const infoTxt = chalk_1.default.cyan;
const iconError = log_symbols_1.default.error;
const iconSuccess = log_symbols_1.default.success;
let Logger = class Logger {
    constructor(silent) {
        this.silent = silent;
        /**
         * @param {string} message
         * @returns void
         */
        this.info = (message) => console.log(infoTxt(message));
        /**
         * @param {string} message
         * @returns void
         */
        this.default = (message) => console.log(message);
        /**
         * @param {string} message
         * @returns void
         */
        this.success = (message) => console.log(`${iconSuccess} ${successTxt(message)}`);
        /**
         * @param {string} message
         * @returns void
         */
        this.error = (message) => console.log(`${iconError} ${errorTxt(message)}`);
        /**
         * @param {string} message
         * @returns void
         */
        this.warn = (message) => !this.silent && console.log(`${warningTxt(message)}`);
        /**
         * @param {string} message
         * @returns void
         */
        this.yellow = (message) => console.log(yellowTxt(message));
    }
};
Logger = __decorate([
    tsyringe_1.singleton()
], Logger);
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map