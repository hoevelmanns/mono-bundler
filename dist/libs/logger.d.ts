export default class Logger {
    silent?: boolean;
    constructor(silent?: boolean);
    /**
     * @param {string} message
     * @returns void
     */
    info(message: string): void;
    /**
     * @param {string} message
     * @returns void
     */
    default(message: string): void;
    /**
     * @param {string} message
     * @returns void
     */
    success(message: string): void;
    /**
     * @param {string} message
     * @returns void
     */
    error(message: string): void;
    /**
     * @param {string} message
     * @returns void
     */
    warn(message: string): void;
    /**
     * @param {string} message
     * @returns void
     */
    yellow(message: string): void;
}
