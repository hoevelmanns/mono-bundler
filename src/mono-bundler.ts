import { RollupOptions } from 'rollup'
import { Config } from './types/config'
import Workspace from './workspace'
import Package from './package'
import Logger from './libs/logger'
import Plugins from './plugins'
import Loader from './loader'


/**
 * @todo description
 */
export default class MonoBundler {

    private rollupConfigurations: RollupOptions[] = []
    private readonly workspace = new Workspace(this.buildOptions)
    private readonly log = new Logger(this.buildOptions.silent)
    private readonly plugins = new Plugins(this.buildOptions)
    protected readonly noRollupOptions: Config.AvailableBuildOptions = ['packages', 'createLoaders', 'hashFileNames']

    constructor(private readonly buildOptions: Config.BuildOptions) {
    }

    async build(): Promise<RollupOptions[]> {

        await this.workspace.init()

        this.buildRollupConfig(this.workspace.packages)

        if (!this.rollupConfigurations.length) {
            this.log.success('All package bundles are present and up-to-date. Nothing to do.')
        }

        this.showModifiedPackages()

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
    private buildRollupConfig = (packages: Package[]): void => {
        const external = id => id.includes('core-js') // todo merge with this.config

        packages.filter(pkg => pkg.isModified).map((pkg: Package) => {

            pkg.output.map(output => {
                this.rollupConfigurations.push({
                    ...this.cleanRollupOptions,
                    ...{
                        plugins: this.plugins.get(output.name),
                        input: pkg.input,
                        external,
                        output,
                    },
                })
            })

        })
    }

    /**
     *
     * @private
     */
    private get cleanRollupOptions() {
        const rollupOptions = { ...this.buildOptions }

        this.noRollupOptions.map(key => delete rollupOptions[key.toString()])
        return rollupOptions
    }

    /**
     *
     * @private
     * @returns void
     */
    private generateLoaders(): void {
        this.workspace.options.createLoaders && this.workspace.modifiedPackages
            .map(async ({ distDir, output, hash }) =>
                new Loader(output).output(distDir, hash))
    }

    /**
     *
     * @private
     * @returns void
     */
    private showModifiedPackages() {
        const { modifiedPackages } = this.workspace
        modifiedPackages.length && this.log.info('Modified packages:')
        modifiedPackages.map(pkg => this.log.yellow(`- ${pkg.name}`))
    }
}
