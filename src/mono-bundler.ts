import Workspace from './workspace'
import { Logger } from './libs'
import Plugins from './plugins'
import Loader from './loader'
import { AvailableBuildOptions, BuildOptions, MonoRollupOptions, TransformedArgs } from './types'
import { container } from 'tsyringe'
import minimist from 'minimist'
import Package from './package'

export class MonoBundler {
	protected workspace: Workspace
	protected readonly log: Logger
	protected processedPackages: Package[] = []
	protected monoRollupOptions: MonoRollupOptions = []
	protected readonly plugins = new Plugins(this.buildOptions)
	protected readonly noRollupOptions: AvailableBuildOptions = ['packages', 'createLoaders', 'hashFileNames', 'legacyBrowserSupport']
	
	/**
	 *
	 * @param {BuildOptions} options
	 */
	constructor(private readonly options: BuildOptions) {
		container.register<BuildOptions>('BuildOptions', { useValue: this.buildOptions })
		container.register<Logger>('Logger', { useValue: this.log = new Logger(this.buildOptions?.silent) })
	}
	
	/**
	 * @private
	 * @returns BuildOptions
	 */
	private get buildOptions(): BuildOptions {
		return { ...this.options, ...MonoBundler.transformedArgs }
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
		
		this.generateRollupConfig()
		
		return this.monoRollupOptions.length ? this.monoRollupOptions : <MonoRollupOptions>{}
	}
	
	/**
	 * @protected
	 */
	private getPackageScriptToBeExecuted() {
		return this.buildOptions.watch ? 'watch' : 'build'
	}
	
	/**
	 *
	 * @private
	 */
	private async runPackageScripts(): Promise<any[]> {
		const event = this.getPackageScriptToBeExecuted()
		const packages = this.workspace.packages
			.filter((pkg: Package) => pkg.scripts[event]?.length > 0)
		
		const runScript = require('@npmcli/run-script')
		const processes = packages.map(pkg => runScript({
			event,
			path: pkg.packageDir,
			stdio: 'inherit',
		}))
		
		return this.buildOptions.watch
			? Promise.resolve(processes)
			: Promise.all(processes)
	}
	
	/**
	 *
	 * @private
	 * @returns void
	 */
	private generateRollupConfig = (): void => {
		const runScript = this.getPackageScriptToBeExecuted()
		const packages = this.workspace.packages
			.filter(pkg => !pkg.scripts[runScript]) // todo set in package.ts "runScript.build" "runScript.watch"
		
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
		const rollupOptions = { ...this.buildOptions }
		this.noRollupOptions.map(key => Reflect.deleteProperty(rollupOptions, key))
		Object.keys(MonoBundler.transformedArgs).map(key => Reflect.deleteProperty(rollupOptions, key))
		return rollupOptions
	}
	
	/**
	 *
	 * @private
	 * @returns void
	 */
	private createLoaders(): void {
		const { buildOptions } = this
		const hashFileNames = buildOptions.hashFileNames
		
		buildOptions.createLoaders && !buildOptions.watch && this.workspace.modifiedPackages
			.map(async ({ distDir, output, hash, bundleName }) =>
				new Loader(output, bundleName, hashFileNames && hash).output(distDir))
	}
}
