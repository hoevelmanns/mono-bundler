import { RollupOptions } from 'rollup';
import { Config } from './types/config';
export default class MonoBundler {
    private readonly buildOptions;
    private rollupConfigurations;
    private workspace;
    private readonly plugins;
    private readonly log;
    protected readonly noRollupOptions: Config.AvailableBuildOptions;
    /**
     *
     * @param {Config.BuildOptions} buildOptions
     */
    constructor(buildOptions: Config.BuildOptions);
    build(): Promise<RollupOptions[]>;
    /**
     *
     * @private
     * @returns void
     */
    private buildRollupConfig;
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
    private generateLoaders;
}
