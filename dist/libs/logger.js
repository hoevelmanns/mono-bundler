import * as logSymbols from 'log-symbols';
import * as chalk from 'chalk';
const errorTxt = chalk.red;
const yellowTxt = chalk.yellow;
const warningTxt = chalk.keyword('orange');
const successTxt = chalk.green;
const infoTxt = chalk.cyan;
const iconError = logSymbols.error;
const iconSuccess = logSymbols.success;
export default class Logger {
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
