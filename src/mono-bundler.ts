import { RollupOptions } from 'rollup'
import { Config } from 'config'
import Workspace from './workspace'
import Package from './package'
import Logger from './libs/logger'
import Plugins from './plugins'
import Loader from './loader'

export class MonoBundler {
    private rollupConfigurations: RollupOptions[] = []
    private workspace = new Workspace(this.buildOptions)
    private readonly plugins = new Plugins(this.buildOptions)
    private readonly log = new Logger(this.buildOptions.silent)
    protected readonly noRollupOptions: Config.AvailableBuildOptions = ['packages', 'createLoaders', 'hashFileNames']

    /**
     *
     * @param {Config.BuildOptions} buildOptions
     */
    constructor(private readonly buildOptions: Config.BuildOptions) {
    }

    async build(): Promise<RollupOptions[]> {

        await this.workspace.init()

        this.buildRollupConfig()

        this.generateLoaders()

        return this.rollupConfigurations.length
            ? this.rollupConfigurations
            : process.exit(0)
    }

    /**
     *
     * @private
     * @returns void
     */
    private buildRollupConfig = (): void => {
        const packages = this.workspace.packages
        const external = (id: string) => id.includes('core-js') // todo merge with this.config
    
        if (!this.workspace.hasModifiedPackages) {
            this.log.success('All package bundles are present and up-to-date. Nothing to do.')
        }
        
        packages.filter(pkg => pkg.isModified).map((pkg: Package) =>
            pkg.output.map(output =>
                this.rollupConfigurations.push({
                    ...this.cleanRollupOptions,
                    ...{
                        plugins: this.plugins.get(output.name),
                        input: pkg.input,
                        external,
                        output,
                    },
                })))
    }

    /**
     *
     * @private
     */
    private get cleanRollupOptions() {
        const rollupOptions = { ...this.buildOptions }
        this.noRollupOptions.map(key => Reflect.deleteProperty(rollupOptions, key))
        return rollupOptions
    }

    /**
     *
     * @private
     * @returns void
     */
    private generateLoaders(): void {
        this.workspace.options.createLoaders && this.workspace.modifiedPackages
            .map(async ({ distDir, output, hash }) => new Loader(output).output(distDir, hash))
    }
}
