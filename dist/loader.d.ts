import { OutputOptions } from 'rollup';
export default class Loader {
    private readonly outputs;
    private filename;
    private hash?;
    private imports;
    /**
     * @param {OutputOptions[]} outputs
     * @param {string} filename
     * @param {string} hash
     */
    constructor(outputs: OutputOptions[], filename: string, hash?: string);
    /**
     *
     * @param {string} destPath
     * @returns void
     */
    output(destPath: string): void;
    /**
     *
     * @param output
     * @returns Loader
     */
    addImport(output: OutputOptions): Loader;
    /**
     * @private
     * @param {OutputOptions} outputOption
     * @returns boolean
     */
    private louderShouldBeSkipped;
    /**
     *
     * @param {OutputOptions} output
     * @returns string
     */
    protected jsImport(output: OutputOptions): string;
    /**
     *
     * @protected
     * @returns string[]
     */
    protected stringifyElementAttributes(bundleName: string): string[];
}
