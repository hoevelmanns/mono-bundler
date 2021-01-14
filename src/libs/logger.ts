import logSymbols from 'log-symbols'
import chalk from 'chalk'

const errorTxt = chalk.red
const yellowTxt = chalk.yellow
const warningTxt = chalk.keyword('orange')
const successTxt = chalk.green
const infoTxt = chalk.cyan
const iconError = logSymbols.error
const iconSuccess = logSymbols.success

export default class Logger {

    constructor(public silent?: boolean) {
        const args = require('minimist')(process.argv.slice(2))
        this.silent = silent ?? args?.silent
    }

    /**
     * @param {string} message
     * @returns void
     */
    info(message: string): void {
        console.log(infoTxt(message))
    }

    /**
     * @param {string} message
     * @returns void
     */
    default(message: string): void {
        console.log(message)
    }

    /**
     * @param {string} message
     * @returns void
     */
    success(message: string): void {
        console.log(`${iconSuccess} ${successTxt(message)}`)
    }

    /**
     * @param {string} message
     * @returns void
     */
    error(message: string): void {
        console.log(`${iconError} ${errorTxt(message)}`)
    }

    /**
     * @param {string} message
     * @returns void
     */
    warn(message: string): void {
        !this.silent && console.log(`${warningTxt(message)}`)
    }

    /**
     * @param {string} message
     * @returns void
     */
    yellow(message: string): void {
        console.log(yellowTxt(message))
    }
}

