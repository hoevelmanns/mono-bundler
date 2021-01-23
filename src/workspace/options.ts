import {MonoOptions, TransformedArgs} from "shared"
import minimist from "minimist"
import {container, injectable} from "tsyringe"
import {InputOptions} from "rollup"

@injectable()
export class Options {

    protected data: Partial<MonoOptions>

    constructor(protected config: Partial<Options>) {
        this.data = {...config, ...this.transformedArgs}
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
    get hashFileNames() {
        return this.data.hashFileNames
    }

    /**
     * @returns MonoOptions.createLoaders
     */
    get createLoaders() {
        return this.data.createLoaders
    }

    /**
     * @returns MonoOptions.plugins
     */
    get plugins() {
        return this.data.plugins
    }

    /**
     * @returns MonoOptions.watch
     */
    get watch() {
        return this.data.watch
    }

    /**
     *
     * @private
     */
    get rollupOptions(): InputOptions {
        const rollupOptions = {...this.data}
        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).map(key => Reflect.deleteProperty(rollupOptions, key))
        Object.keys(this.transformedArgs).map(key => Reflect.deleteProperty(rollupOptions, key))
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
    protected get transformedArgs(): TransformedArgs { // todo
        const args = minimist(process.argv.slice(2))
        args.watch = args.w ?? args.watch ?? false
        return args
    }
}


export const options = (config: Partial<Options>) => container.register<Options>('Options', {useFactory: () => new Options(config)})