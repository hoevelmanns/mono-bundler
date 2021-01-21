import Dependency from './dependency';
import Package from './package';
import { Logger } from './libs';
import { BuildOptions } from './types';
export default class Workspace {
    packages: Package[];
    dependencies: (Dependency | [string, unknown])[];
    private globs;
    protected readonly log: Logger;
    protected readonly buildOptions: BuildOptions;
    init(): Promise<Workspace>;
    /**
     * @returns Package[]
     */
    get modifiedPackages(): Package[];
    /**
     * @returns boolean
     */
    get hasModifiedPackages(): boolean;
    /**
     *
     * @private
     * @returns void
     */
    private setGlobs;
    /**
     * Gets the list of package json files of defined projects
     *
     * @returns Promise<void>
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
    private showReport;
}
