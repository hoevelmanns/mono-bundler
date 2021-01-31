import path from 'path'
import { existsSync } from 'fs'
import { boldTxt, Bundle, Bundles, getBundle, Loader, Logger, concatFilename } from 'shared'
import RollupPlugins from './plugins'
import { Options, Package, Packages } from 'workspace'
import { Compiler, MonoRollupOptions } from '../types'
import { autoInjectable, inject } from 'tsyringe'
import { OutputOptions } from 'rollup'
import { rollup } from 'rollup'
import { Listr, ListrContext, ListrTask, ListrTaskWrapper } from 'listr2'
import lodash from 'lodash'
import { Bundler } from '../decorators'

@autoInjectable()
@Bundler(
	'rollup',
	'Classic packages',
)
export class Rollup implements Compiler {
	protected readonly plugins = new RollupPlugins()
	protected rollupOptions: MonoRollupOptions = []
	
	constructor(
		@inject('Options') protected options?: Options,
		@inject('Packages') protected packages?: Packages,
		@inject('Logger') protected log?: Logger,
	) {
	}
	
	/**
	 * @param {ListrContext} ctx
	 * @param {ListrTaskWrapper} task
	 * @returns ListrTask[]
	 */
	readonly tasks = (ctx: ListrContext, task?: ListrTaskWrapper<any, any>): Listr => {
		if (!this.rollupPackages.length) {
			task.title = `${task.title}: Packages are up-to-date. Nothing to do.`
			return
		}
		
		return task.newListr([
			{
				title: boldTxt('Building configuration'),
				task: (): Promise<void> => this.generateConfig(),
			},
			{
				title: boldTxt('Bundling'),
				task: (ctx, task): Listr => task.newListr(this.build),
			},
			{
				enabled: (): boolean => this.options.createLoaders,
				title: boldTxt('Creating loaders'),
				task: (): Promise<void> => this.createLoaders(),
			},
		], { exitOnError: true })
	}
	
	/**
	 *
	 * @private
	 */
	private readonly build = (): ListrTask[] => {
		const tasks: ListrTask[] = []
		const groupedRollupOptions = lodash.groupBy(this.rollupOptions, 'context')
		
		Object.entries(groupedRollupOptions).map(([moduleName, options]) => tasks.push({
			title: moduleName,
			task: async () => Promise.all(options.map(async opt => {
				const bundle = await rollup(opt)
				const output = Array.isArray(opt.output) ? opt.output : [opt.output]
				output.map(bundle.write)
				await bundle.close()
				await this.packages.get(moduleName).updateHash()
			})),
		}))
		
		return tasks
	}
	
	/**
	 *
	 * @private
	 */
	private get rollupPackages(): Package[] {
		return this.packages.getProcessable()
			.filter(pkg => this.isRollupModule(pkg))
	}
	
	/**
	 *
	 * @param {Package} pkg
	 * @private
	 */
	private readonly isRollupModule = (pkg: Package): boolean => {
		const moduleResolution = pkg.tsConfig?.compilerOptions?.moduleResolution?.toLowerCase()
		return !!pkg.engines?.rollup || (moduleResolution !== 'node' && !pkg.engines?.node)
	}
	
	/**
	 *
	 * @private
	 * @returns void
	 */
	private readonly generateConfig = async (): Promise<void> => {
		const external = (id: string) => id.includes('core-js') // todo merge with this.config
		
		this.rollupPackages.map(async pkg => (await this.getPackageOutput(pkg))
			.map(output =>
				this.rollupOptions.push({
					...this.options.rollupOptions,
					...{
						plugins: this.plugins.get(output, pkg),
						input: this.getInput(pkg),
						external,
						output,
						context: pkg.name,
					},
				})))
	}
	
	/**
	 *
	 * @private
	 * @param {Bundle} target
	 * @returns boolean
	 */
	private targetShouldBeSkipped(target: Bundle): boolean {
		return 'legacy' === target.type && !this.options.legacyBrowserSupport
	}
	
	/**
	 *
	 * @private
	 * @param {Bundle} bundle
	 * @param {Package} pkg
	 * @returns string
	 */
	private async generateOutputFilename(bundle: Bundle, pkg: Package): Promise<string> {
		const filename = concatFilename(
			path.join(pkg.packageDir, pkg.main),
			bundle.extraFileExtension,
		)
		
		return this.options.hashFileNames
			? concatFilename(filename, pkg.currentHash)
			: filename
	}
	
	/**
	 *
	 *
	 * @private
	 * @returns void
	 */
	private async createLoaders(): Promise<void> {
		const hashFileNames = this.options.hashFileNames
		const packages = this.packages.getProcessable()
		
		if (!this.options.createLoaders && !this.options.watch) {
			return
		}
		
		await Promise.all(packages
			.filter(pkg => this.isRollupModule(pkg))
			.map(async ({ distDir, output, currentHash, bundleName, name }) =>
				await new Loader(output, bundleName, hashFileNames && currentHash).output(distDir)))
	}
	
	/**
	 *
	 * @private
	 * @returns void
	 */
	private async getPackageOutput(pkg: Package): Promise<OutputOptions[]> {
		const { output, packageDir, main } = pkg
		
		this.options.hashFileNames && output.push({
			name: 'default',
			file: path.join(packageDir, main),
			format: getBundle('default').format,
		})
		
		Bundles
			.filter(target => !this.targetShouldBeSkipped(target))
			.map(async target => output.push({
				name: target.type,
				file: await this.generateOutputFilename(target, pkg),
				format: target.format,
			}))
		
		return output
	}
	
	/**
	 *
	 * @private
	 * @returns void
	 */
	private readonly getInput = (pkg: Package): string => {
		const inputTS = path.join(pkg.sourceDir, 'index.ts')
		const inputJS = path.join(pkg.sourceDir, 'index.js')
		
		return existsSync(inputTS) ? inputTS : existsSync(inputJS) ? inputJS : null
	}
}