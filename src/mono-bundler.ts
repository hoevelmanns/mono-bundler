import Workspace from './workspace'
import {Logger} from './libs'
import Plugins from './plugins'
import Loader from './loader'
import {AvailableBuildOptions, BuildOptions, MonoRollupOptions, TransformedArgs} from './types'
import {container} from 'tsyringe'
import minimist from 'minimist'

export class MonoBundler {
    protected workspace: Workspace
    protected readonly log: Logger
    protected monoRollupOptions: MonoRollupOptions = []
    protected readonly args = MonoBundler.transformedArgs
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
    private get buildOptions(): BuildOptions {
        const {options} = this
        // todo config switch options.createLoaders = !options.watch
        // todo config switch options.legacyBrowserSupport = !options.watch
        return {...options, ...this.args}
    }

    /**
     * @private
     * @returns TransformedArgs
     */
    private static get transformedArgs(): TransformedArgs {
        const args = minimist(process.argv.slice(2))
        args.watch = args.w ?? args.watch ?? false
        return args
    }

    async build(): Promise<MonoRollupOptions> {

        this.workspace = await new Workspace().init()

        this.createLoaders()

        if (!(this.workspace.hasModifiedPackages || this.buildOptions.watch)) {
            this.log.success('All package bundles are present and up-to-date. Nothing to do.')
            process.exit()
        }

        await this.runPackageScripts()

        // todo runNCC on packages with "ncc"-field

        this.generateRollupConfig()

        return this.monoRollupOptions.length ? this.monoRollupOptions : process.exit()
    }

    /**
     *
     * @private
     */
    private async runPackageScripts(): Promise<any[]> {
        const command = this.buildOptions.watch ? 'watch' : 'build' // todo config
        const packages = this.workspace.modifiedPackages
            .filter(pkg => pkg.scripts[command]?.length > 0)

        const runScripts = packages.map(pkg => require('@npmcli/run-script')({
            event: command,
            path: pkg.packageDir,
            stdio: 'inherit'
        }))

        return this.buildOptions.watch
            ? Promise.resolve(runScripts)
            : Promise.all(runScripts)
    }

    /**
     *
     * @private
     * @returns void
     */
    private generateRollupConfig = (): void => {
        const packages = this.workspace.packages
            .filter(pkg => pkg.scripts && !pkg.scripts[this.buildOptions.watch ? 'watch' : 'build']) // todo set in package.ts "runScript.build" "runScript.watch"
            .filter(pkg => this.buildOptions.watch || pkg.isModified)

        const external = (id: string) => id.includes('core-js') // todo merge with this.config

        packages.map(pkg =>
            pkg.output.map(output =>
                this.monoRollupOptions.push({
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
