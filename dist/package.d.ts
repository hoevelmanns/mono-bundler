import Dependency from './dependency';
import { OutputOptions } from 'rollup';
import { Directories, Engines, Scripts } from './types';
export default class Package {
    private readonly pkgJsonFile;
    name: string;
    main: string;
    bundleName: string;
    dependencies: Dependency[];
    devDependencies: Dependency[];
    engines: Engines;
    scripts: Scripts;
    tsConfigPath: string;
    packageDir: string;
    sourceDir: string;
    distDir: string;
    directories: Directories;
    input: string;
    output: OutputOptions[];
    hash: string;
    isModified: boolean;
    isIgnored: boolean;
    private readonly log;
    private readonly buildOptions;
    /**
     * @param {string} pkgJsonFile
     */
    constructor(pkgJsonFile: string);
    /**
     *
     * @private
     * @returns Package
     */
    init(): Promise<Package>;
    /**
     *
     * @private
     */
    private setTsConfig;
    /**
     * @private
     * @returns void
     */
    private setBundleFilename;
    /**
     * @private
     * @returns void
     */
    private checkIfModified;
    /**
     *
     * @private
     * @returns void
     */
    private setRollupInput;
    /**
     *
     * @private
     * @returns boolean
     */
    private packageShouldBeSkipped;
    /**
     *
     * @param {Bundle} target
     * @private
     */
    private targetShouldBeSkipped;
    /**
     *
     * @private
     * @param {Bundle} bundle
     * @returns string
     */
    private generateOutputFilename;
    /**
     *
     * @private
     * @returns void
     */
    setRollupOutput(): void;
    /**
     *
     * @private
     * @returns void
     */
    private setHash;
    /**
     * @private
     * @returns void
     */
    private outputHashFile;
    /**
     *
     * @private
     * @returns void
     */
    private setDirectories;
}
