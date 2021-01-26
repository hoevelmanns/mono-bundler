import path from 'path'
import { existsSync } from 'fs'
import { concatFilename } from '../../shared/filesystem'
import { Bundle, Bundles, getBundle, Loader, Logger } from 'shared'
import RollupPlugins from './plugins'
import { Options, Package, Packages } from 'workspace'
import { Compiler } from '../decorators'
import { ICompiler, MonoRollupOptions } from '../types'
import { autoInjectable, inject } from 'tsyringe'
import { RollupOptions } from 'rollup'
import { rollup, watch } from 'rollup'

@autoInjectable()
@Compiler('rollup')
export class RollupCompiler implements ICompiler {
	protected readonly plugins = new RollupPlugins()
	protected rollupOptions: MonoRollupOptions = []
	
	constructor(
		@inject('Options') protected options?: Options,
		@inject('Packages') protected packages?: Packages,
		@inject('Logger') protected log?: Logger,
	) {
	}
	
	/**
	 * @description - builds the founded classic packages
	 * @returns void
	 */
	async execute(): Promise<void> {
		this.log.spinner.start('Build classic bundles').start()
		
		await this.generateConfig()
		
		// todo trigger rollup build or watch
		
		await Promise.all(this.rollupOptions.map(async (opt: RollupOptions) => {
			this.log.spinner.text = `Bundling ${opt.context}...`
			const bundle = await rollup(opt)
			const output = Array.isArray(opt.output) ? opt.output : [opt.output]
			await Promise.all(output.map(bundle.write))
			await this.packages.getProcessable().filter(p => p.name === opt.context).shift().updateHash() // todo
		}))
		
		if (this.rollupOptions.length > 0) {
			await this.createLoaders()
		}
		
		this.log.spinner.stop()
	}
	
	/**
	 *
	 * @param {Package} pkg
	 * @private
	 */
	private isRollupModule = (pkg: Package): boolean => {
		const moduleResolution = pkg.tsConfig?.compilerOptions?.moduleResolution?.toLowerCase()
		return !(moduleResolution === 'node' || pkg.engines?.node)
	}
	
	/**
	 *
	 * @private
	 * @returns void
	 */
	private generateConfig = async (): Promise<void> => {
		const packages = this.packages.getProcessable()
			.filter(pkg => this.isRollupModule(pkg))
		
		const external = (id: string) => id.includes('core-js') // todo merge with this.config
		
		await packages.map(async pkg => {
			const bundles = await this.getBundles(pkg)
			
			bundles.output.map(output =>
				this.rollupOptions.push({
					...this.options.rollupOptions,
					...{
						plugins: this.plugins.get(output, pkg),
						input: this.getInput(pkg),
						external,
						output,
						context: pkg.name,
					},
				}))
		})
	}
	
	/**
	 *
	 * @param {Bundle} target
	 * @private
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
		const filename = concatFilename(path.join(pkg.packageDir, pkg.main), bundle.extraFileExtension)
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
	private async getBundles(pkg: Package): Promise<Package> {
		const { output, packageDir, main } = pkg
		
		this.options.hashFileNames && output.push({
			name: 'default',
			file: path.join(packageDir, main),
			format: getBundle('default').format,
		})
		
		await Bundles
			.filter(target => !this.targetShouldBeSkipped(target))
			.map(async target => output.push({
				name: target.type,
				file: await this.generateOutputFilename(target, pkg),
				format: target.format,
			}))
		
		return pkg
	}
	
	/**
	 *
	 * @private
	 * @returns void
	 */
	private getInput = (pkg: Package): string => {
		const inputTS = path.join(pkg.sourceDir, 'index.ts')
		const inputJS = path.join(pkg.sourceDir, 'index.js')
		
		return existsSync(inputTS) ? inputTS : existsSync(inputJS) ? inputJS : null
	}
}

export const rollupCompiler = () => new RollupCompiler()