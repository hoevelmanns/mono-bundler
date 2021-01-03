import { OutputOptions, RollupOptions } from 'rollup'
import { Config } from './types/config'
import fileSystem from './libs/filesystem'
import Workspace from './workspace'
import Package from './package'
import Plugins from './plugins'
import Logger from './libs/logger'
import Loader from './loader'

/**
 * @todo description
 */
export default class MonoBundler {

    private modifiedPackages: { [name: string]: Package } = {}
    private rollupConfigurations: RollupOptions[] = []
    private readonly plugins = new Plugins(this.buildOptions)
    private readonly workspace = new Workspace(this.buildOptions)
    private readonly log = new Logger(this.buildOptions.silent)
    private readonly args = require('minimist')(process.argv.slice(2))
    protected readonly noRollupOptions: Config.AvailableBuildOptions = ['packages', 'createLoaders', 'legacySupport']

    constructor(private readonly buildOptions: Config.BuildOptions) {
    }

    async build(): Promise<RollupOptions[]> {
        await Promise.all(this.workspace.packages.map(async pkg => pkg.main && await this.addRollupConfig(pkg)))

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
     * @private
     */
    private get option() {
        return { ...this.buildOptions, ...this.args }
    }

    /**
     *
     * @private
     * @param {Package} pkg - Package
     * @returns void
     */
    private addRollupConfig = async (pkg: Package): Promise<void> => {
        const { input } = pkg
        const external = id => id.includes('core-js') // todo merge with this.config

        await Promise.all(this.targets.map(async target => {

            const output = await pkg.output(target)
            const { modifiedPackages, rollupConfigurations } = this

            if (!input || this.bundleShouldBeSkipped(output, target)) {
                return
            }

            pkg.bundles.push({ file: output.file, target })

            modifiedPackages[pkg.name] = pkg

            rollupConfigurations.push({
                ...this.cleanRollupOptions,
                ...{
                    input,
                    external,
                    output: target === Config.Target.default
                        ? [output, await pkg.output(Config.Target.default, false)]
                        : output,
                    plugins: this.plugins.get(target),
                },
            })
        }))
    }

    /**
     *
     * @private
     */
    private get cleanRollupOptions() {
        const rollupOptions = { ...this.buildOptions }

        this.noRollupOptions.map(key => delete rollupOptions[key])
        return rollupOptions
    }

    /**
     *
     * @private
     * @returns void
     */
    private generateLoaders(): void {
        this.option.createLoaders && Object.entries(this.modifiedPackages)
            .map(async ([_, { distDir, bundles, hash }]) =>
                new Loader(bundles).output(distDir, await hash.get()))
    }

    /**
     *
     * @private
     * @returns void
     */
    private showModifiedPackages() {
        const modifiedPackages = Object.keys(this.modifiedPackages)

        modifiedPackages.length && this.log.info('Modified packages:')
        modifiedPackages.map(name => this.log.yellow(`- ${name}`))
    }

    /**
     *
     * @private
     */
    private get targets() {
        return this.option?.legacySupport
            ? [Config.Target.default, Config.Target.legacy]
            : [Config.Target.default]
    }

    /**
     *
     * @param {OutputOptions} output
     * @param {string} target
     * @returns void
     */
    private bundleShouldBeSkipped = (output: OutputOptions, target: string): boolean =>
        this.option?.watch && target === Config.Target.legacy || !this.option?.watch && fileSystem.existsSync(output.file)
}
