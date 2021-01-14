import { Config } from './types/config';
import { OutputOptions } from 'rollup';
export default class Loader {
    private outputs;
    private imports;
    /**
     * @param {OutputOptions[]} outputs
     */
    constructor(outputs: OutputOptions[]);
    /**
     *
     * @param {string} targetPath
     * @param {string} hash
     * @param {boolean} createHashFile
     * @returns void
     */
    output(targetPath: string, hash?: string, createHashFile?: boolean): void;
    /**
     *
     * @returns Loader
     * @param output
     */
    addImport(output: OutputOptions): Loader;
    /**
     *
     * @returns string
     * @param {OutputOptions} output
     */
    protected jsImport(output: OutputOptions): string;
    /**
     *
     * @param {Bundle} bundle
     * @returns string
     */
    protected cssImport(bundle: Config.Bundle): void;
}
