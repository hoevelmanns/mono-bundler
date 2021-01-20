import {RollupOptions} from 'rollup'
import Workspace from './workspace'
import {Logger} from './libs'
import Plugins from './plugins'
import Loader from './loader'
import {AvailableBuildOptions, BuildOptions} from './types'
import {container} from 'tsyringe'
import minimist from 'minimist'

export class MonoBundler {
    protected rollupConfigurations: RollupOptions[] = []
    protected workspace: Workspace
    protected readonly log: Logger
    protected readonly args = minimist(process.argv.slice(2))
    protected readonly plugins = new Plugins(this.buildOptions)
    protected readonly noRollupOptions: AvailableBuildOptions = ['packages', 'createLoaders', 'hashFileNames', 'legacyBrowserSupport']

    /**
     *
     * @param {BuildOptions} options
     */
    constructor(private readonly options: BuildOptions) {
        container.register<BuildOptions>('BuildOptions', {useValue: this.buildOptions})
        container.register<Logger>('Logger', {useValue: this.log = new Logger(this.buildOptions?.silent)})
    }

    /**
     * @private
     * @returns BuildOptions
     */
    get buildOptions(): BuildOptions {
        return {...this.options, ...this.args}
    }

    async build(): Promise<RollupOptions[]> {

        await this.init()

        this.createLoaders()

        this.buildRollupConfig()

        return this.rollupConfigurations.length
            ? this.rollupConfigurations
            : process.exit(0)
    }

    /**
     * @returns void
     */
    async init() {

        this.workspace = await new Workspace().init()
    }

    /**
     *
     * @private
     * @returns void
     */
    private buildRollupConfig = (): void => {
        const packages = this.buildOptions.watch
            ? this.workspace.packages
            : this.workspace.packages.filter(pkg => pkg.isModified)
        const external = (id: string) => id.includes('core-js') // todo merge with this.config

        if (!(this.workspace.hasModifiedPackages || this.buildOptions.watch)) {
            this.log.success('All package bundles are present and up-to-date. Nothing to do.')
        }

        packages.map(pkg =>
            pkg.output.map(output =>
                this.rollupConfigurations.push({
                    ...this.cleanRollupOptions,
                    ...{
                        plugins: this.plugins.get(output, pkg),
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
        const rollupOptions = {...this.buildOptions}
        this.noRollupOptions.map(key => Reflect.deleteProperty(rollupOptions, key))
        Object.keys(this.args).map(key => Reflect.deleteProperty(rollupOptions, key))
        return rollupOptions
    }

    /**
     *
     * @private
     * @returns void
     */
    private createLoaders(): void {
        const {buildOptions} = this
        const hashFileNames = buildOptions.hashFileNames

        buildOptions.createLoaders && !buildOptions.watch && this.workspace.modifiedPackages
            .map(async ({distDir, output, hash, bundleFilename}) =>
                new Loader(output, bundleFilename, hashFileNames && hash).output(distDir))
    }
}
