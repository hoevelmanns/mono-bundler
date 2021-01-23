import logSymbols from 'log-symbols'
import chalk from 'chalk'
import {autoInjectable, container, inject} from 'tsyringe'
import {Options} from "workspace"

export const errorTxt = chalk.red
export const yellowTxt = chalk.yellow
export const warningTxt = chalk.keyword('orange')
export const successTxt = chalk.green
export const infoTxt = chalk.cyan
export const iconError = logSymbols.error
export const iconSuccess = logSymbols.success

@autoInjectable()
export class Logger {

    constructor(@inject('Options') protected options?: Options) {
    }

    /**
     * @param {string} message
     * @returns void
     */
    info = (message: string): void => console.log(infoTxt(message))

    /**
     * @param {string} message
     * @returns void
     */
    default = (message: string): void => console.log(message)

    /**
     * @param {string} message
     * @returns void
     */
    success = (message: string): void => console.log(`${iconSuccess} ${successTxt(message)}`)

    /**
     * @param {string} message
     * @returns void
     */
    error = (message: string): void => console.log(`${iconError} ${errorTxt(message)}`)

    /**
     * @param {string} message
     * @returns void
     */
    warn = (message: string): void => !this.options?.silent && console.log(`${warningTxt(message)}`)

    /**
     * @param {string} message
     * @returns void
     */
    yellow = (message: string): void => console.log(yellowTxt(message))
}

export const logger = () => container.register<Logger>('Logger', {useValue: new Logger()})
