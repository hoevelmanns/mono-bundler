import Workspace from './workspace';
import { Logger } from './libs';
import Plugins from './plugins';
import { AvailableBuildOptions, BuildOptions, MonoRollupOptions } from './types';
import Package from './package';
export declare class MonoBundler {
    private readonly options;
    protected workspace: Workspace;
    protected readonly log: Logger;
    protected processedPackages: Package[];
    protected monoRollupOptions: MonoRollupOptions;
    protected readonly plugins: Plugins;
    protected readonly noRollupOptions: AvailableBuildOptions;
    /**
     *
     * @param {BuildOptions} options
     */
    constructor(options: BuildOptions);
    /**
     * @private
     * @returns BuildOptions
     */
    private get buildOptions();
    /**
     * @private
     * @returns TransformedArgs
     */
    private static get transformedArgs();
    build(): Promise<MonoRollupOptions>;
    /**
     * @protected
     */
    private getPackageScriptToBeExecuted;
    /**
     *
     * @private
     */
    private runPackageScripts;
    /**
     *
     * @private
     * @returns void
     */
    private generateRollupConfig;
    /**
     *
     * @private
     */
    private get cleanRollupOptions();
    /**
     *
     * @private
     * @returns void
     */
    private createLoaders;
}
