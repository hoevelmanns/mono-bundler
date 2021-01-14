import Dependency from './dependency';
import Package from './package';
import { Config } from './types/config';
export default class Workspace {
    protected readonly buildOptions: Config.BuildOptions;
    packages: Package[];
    dependencies: Dependency[];
    private globs;
    private log;
    private readonly args;
    constructor(buildOptions: Config.BuildOptions);
    init(): Promise<Workspace>;
    get modifiedPackages(): Package[];
    /**
     * @private
     */
    get options(): any;
    private setGlobs;
    /**
     * Gets the list of package json files of defined projects
     *
     * @returns void
     */
    private findPackages;
    /**
     * Gets all dependencies of defined projects
     *
     * @returns void
     */
    private findDependencies;
    /**
     *
     * @private
     * @returns void
     */
    private showModifiedPackages;
}
