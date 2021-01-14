import Dependency from './dependency';
import { OutputOptions } from 'rollup';
import { Config } from './types/config';
interface Browser {
    umd?: string;
    esm?: string;
}
interface Directories {
    source?: string;
}
export default class Package {
    private readonly pkgJsonFile;
    protected buildOptions: Config.BuildOptions;
    name: string;
    main: string;
    browser?: Browser;
    dependencies: Dependency[];
    devDependencies: Dependency[];
    packageDir: string;
    sourceDir: string;
    distDir: string;
    directories: Directories;
    input: string;
    output: OutputOptions[];
    hash: string;
    isModified: boolean;
    isIgnored: boolean;
    /**
     * @param {string} pkgJsonFile
     * @param {Config.BuildOptions} buildOptions
     */
    constructor(pkgJsonFile: string, buildOptions: Config.BuildOptions);
    /**
     *
     * @private
     * @returns void
     */
    init(): Promise<Package>;
    /**
     * @private
     * @returns boolean
     */
    private checkIfModified;
    private shouldBeIgnored;
    /**
     *
     * @private
     * @returns void
     */
    private setRollupInput;
    /**
     *
     * @private
     */
    setRollupOutput(): void;
    /**
     *
     * @private
     * @returns void
     */
    private setHash;
    outputHashFile(): void;
    /**
     *
     * @private
     * @returns void
     */
    private setDirectories;
}
export {};
