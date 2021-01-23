import {Bundle, Bundles, fileSystem, getBundle, Loader, Logger} from "shared"
import RollupPlugins from "./plugins"
import {Options, Package, Packages, Workspace} from "workspace"
import {Compiler} from "../decorators"
import {ICompiler, MonoRollupOptions} from "../types"
import {autoInjectable, inject} from "tsyringe"
import ora from 'ora'
import {RollupOptions} from "rollup"
import {rollup, watch} from 'rollup' // todo watch

@autoInjectable()
@Compiler('rollup')
export class RollupCompiler implements ICompiler {
    protected readonly plugins = new RollupPlugins()
    protected rollupOptions: MonoRollupOptions = []
    private spinner = ora('Build classic bundles').start()

    constructor(
        @inject('Options') protected options?: Options,
        @inject('Packages') protected packages?: Packages,
        @inject('Workspace') protected workspace?: Workspace,
        @inject('Logger') protected log?: Logger
    ) {
        return this
    }

    /**
     * @description - builds the founded classic packages
     * @returns void
     */
    async build(): Promise<void> {

        this.generateConfig()

        // todo trigger rollup build or watch
        // todo only on success ---------> this.createLoaders()
        //console.log(this.rollupOptions)
        //return this.rollupOptions.length ? this.rollupOptions : <MonoRollupOptions>{}

        await Promise.all(this.rollupOptions.map(async (opt: RollupOptions) => {
            this.spinner.text = `Bundling ${opt.context}...`
            const bundle = await rollup(opt)
            const output = Array.isArray(opt.output) ? opt.output : [opt.output]
            await Promise.all(output.map(bundle.write))
        }))

        if (this.rollupOptions.length > 0) {
            await this.createLoaders()
        }

        this.spinner.stop()

    }

    /**
     *
     * @param {Package} pkg
     * @private
     */
    private static isRollupModule(pkg: Package): boolean {
        const moduleResolution = pkg.tsConfig?.compilerOptions?.moduleResolution?.toLowerCase()
        return !(moduleResolution && moduleResolution === 'node' || pkg.engines?.node)
    }

    /**
     *
     * @private
     * @returns void
     */
    private generateConfig = (): void => {
        const packages = this.packages.modified // todo use .processable for watch
            .filter(pkg => RollupCompiler.isRollupModule(pkg))
        const external = (id: string) => id.includes('core-js') // todo merge with this.config

        packages.map(pkg => this.getBundles(pkg).output.map(output =>
            this.rollupOptions.push({
                ...this.options.rollupOptions,
                ...{
                    plugins: this.plugins.get(output, pkg),
                    input: pkg.input,
                    external,
                    output,
                    context: pkg.name
                },
            })))
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
    private generateOutputFilename(bundle: Bundle, pkg: Package): string {
        const filename = fileSystem.concat(fileSystem.join(pkg.packageDir, pkg.main), bundle.extraFileExtension)
        return !this.options.hashFileNames ? filename : fileSystem.concat(filename, pkg.hash)
    }

    /**
     *
     * @private
     * @returns void
     */
    private async createLoaders(): Promise<void> {
        const hashFileNames = this.options.hashFileNames

        if (!this.options.createLoaders && !this.options.watch) {
            return
        }

        await Promise.all(this.packages.processable.filter(pkg => RollupCompiler.isRollupModule(pkg))
            .map(async ({distDir, output, hash, bundleName, name}) => {
                await new Loader(output, bundleName, hashFileNames && hash).output(distDir)
            }))

    }

    /**
     *
     * @private
     * @returns void
     */
    getBundles(pkg: Package): Package {
        const {output, packageDir, main} = pkg

        this.options.hashFileNames && output.push({
            name: 'default',
            file: fileSystem.join(packageDir, main),
            format: getBundle('default').format,
        })

        Bundles
            .filter(target => !this.targetShouldBeSkipped(target))
            .map(async target => {

                output.push({
                    name: target.type,
                    file: this.generateOutputFilename(target, pkg),
                    format: target.format,
                })
            })

        return pkg
    }
}

export const rollupCompiler = () => new RollupCompiler()