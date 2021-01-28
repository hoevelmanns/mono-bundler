import { container, injectable, singleton } from 'tsyringe'
import { MonoOptions, TransformedArgs } from 'shared'
import { InputOptions } from 'rollup'
import minimist from 'minimist'

@singleton()
@injectable()
export class Options {
	private readonly data: Partial<MonoOptions>
	
	constructor(private readonly config: Partial<Options>) {
		this.data = { ...config, ...this.transformedArgs }
		this.setExclude()
	}
	
	/**
	 * @returns MonoOptions.legacyBrowserSupport
	 */
	get legacyBrowserSupport(): MonoOptions['legacyBrowserSupport'] {
		return this.data.legacyBrowserSupport
	}
	
	/**
	 * @returns MonoOptions.packages
	 */
	get packages(): MonoOptions['packages'] {
		return this.data.packages
	}
	
	/**
	 * @returns MonoOptions.exclude
	 */
	get exclude(): MonoOptions['exclude'] {
		return this.data.exclude
	}
	
	/**
	 * @returns MonoOptions.silent
	 */
	get silent(): MonoOptions['silent'] {
		return this.data.silent
	}
	
	/**
	 * @returns MonoOptions.hashFileNames
	 */
	get hashFileNames(): MonoOptions['hashFileNames'] {
		return this.data.hashFileNames
	}
	
	/**
	 * @returns MonoOptions.createLoaders
	 */
	get createLoaders(): MonoOptions['createLoaders'] {
		return this.data.createLoaders
	}
	
	/**
	 * @returns MonoOptions.plugins
	 */
	get plugins(): MonoOptions['plugins'] {
		return this.data.plugins
	}
	
	/**
	 * @returns MonoOptions.watch
	 */
	get watch(): MonoOptions['watch'] {
		return this.data.watch
	}
	
	/**
	 *
	 * @private
	 */
	get rollupOptions(): InputOptions {
		const rollupOptions = { ...this.data }
		
		Object.getOwnPropertyNames(Object.getPrototypeOf(this))
			.map(key => Reflect.deleteProperty(rollupOptions, key))
		
		Object.keys(this.transformedArgs)
			.map(key => Reflect.deleteProperty(rollupOptions, key))
		
		return rollupOptions
	}
	
	/**
	 *
	 * @protected
	 */
	protected setExclude(): void {
		this.data.exclude = [...this.data.exclude ?? [], ...['node_modules']]
	}
	
	/**
	 * @private
	 * @returns TransformedArgs
	 */
	protected get transformedArgs(): TransformedArgs {
		const args = minimist(process.argv.slice(2))
		args.watch = args.w ?? args.watch ?? false
		return args
	}
}

export const options = (config: Partial<Options>) =>
	container.register<Options>('Options', { useFactory: () => new Options(config) })