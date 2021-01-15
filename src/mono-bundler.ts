import { RollupOptions } from 'rollup'
import Workspace from './workspace'
import Package from './package'
import { Logger } from './libs'
import Plugins from './plugins'
import Loader from './loader'
import { AvailableBuildOptions, BuildOptions } from './types'

export class MonoBundler {
    private rollupConfigurations: RollupOptions[] = []
    private workspace = new Workspace(this.buildOptions)
    private readonly plugins = new Plugins(this.buildOptions)
    private readonly log = new Logger(this.buildOptions.silent)
    protected readonly noRollupOptions: AvailableBuildOptions = ['packages', 'createLoaders', 'hashFileNames']

    /**
     *
     * @param {BuildOptions} buildOptions
     */
    constructor(private readonly buildOptions: BuildOptions) {
    }

    async build(): Promise<RollupOptions[]> {

        await this.workspace.init()

        this.createLoaders()

        this.buildRollupConfig()

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
        const packages = this.workspace.options.watch
            ? this.workspace.packages
            : this.workspace.packages.filter(pkg => pkg.isModified)
        const external = (id: string) => id.includes('core-js') // todo merge with this.config

        if (!(this.workspace.hasModifiedPackages || this.workspace.options.watch)) {
            this.log.success('All package bundles are present and up-to-date. Nothing to do.')
        }

        packages
            .map((pkg: Package) =>
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
    private createLoaders(): void {
        const hashFileNames = this.workspace.options.hashFileNames

        this.workspace.options.createLoaders && !this.workspace.options.watch && this.workspace.modifiedPackages
            .map(async ({ distDir, output, hash, bundleFilename }) =>
                new Loader(output, bundleFilename).output(distDir, hashFileNames && hash))
    }
}
