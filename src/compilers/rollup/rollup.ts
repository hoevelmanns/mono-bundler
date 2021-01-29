import path from 'path'
import {existsSync} from 'fs'
import {concatFilename} from '../../shared/filesystem'
import {Bundle, Bundles, getBundle, Loader, Logger} from 'shared'
import RollupPlugins from './plugins'
import {Options, Package, Packages} from 'workspace'
import {Compiler, MonoRollupOptions} from '../types'
import {autoInjectable, inject} from 'tsyringe'
import {OutputOptions} from 'rollup'
import {rollup} from 'rollup'
import {Listr, ListrContext, ListrTask, ListrTaskWrapper} from 'listr2'
import lodash from 'lodash'
import {Bundler} from '../decorators'

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
     * @param task
     * @returns ListrTask[]
     */
    readonly tasks = (ctx: ListrContext, task?: ListrTaskWrapper<any, any>): Listr => task.newListr([
        {
            title: 'Building configuration',
            task: (): Promise<void> => this.generateConfig(),
        },
        {
            title: 'Bundling',
            task: (ctx, task): Listr => task.newListr(this.build),
        },
        {
            title: 'Creating loaders',
            enabled: this.options.createLoaders,
            task: (): Promise<void> => this.createLoaders(),
        },
    ], {exitOnError: true})


    /**
     *
     * @private
     */
    private readonly build = (): ListrTask[] => {
        const tasks: ListrTask[] = []
        const groupedRollupOptions = lodash.groupBy(this.rollupOptions, 'context')

        Object.entries(groupedRollupOptions).map(([moduleName, options]) => {
            tasks.push({
                title: moduleName,
                task: async () => Promise.all(options.map(async opt => {
                    const bundle = await rollup(opt)
                    const output = Array.isArray(opt.output) ? opt.output : [opt.output]

                    await Promise.all(output.map(bundle.write))
                    await bundle.close()
                    await this.updatePackageHash(moduleName)
                })),
            })
        })

        return tasks
    }

    /**
     *
     * @param {string} moduleName
     * @private
     */
    private updatePackageHash = async (moduleName: string) => await this.packages.getProcessable()
        .filter(p => p.name === moduleName)
        .shift()
        .updateHash()


    /**
     *
     * @param {Package} pkg
     * @private
     */
    private readonly isRollupModule = (pkg: Package): boolean => {
        const moduleResolution = pkg.tsConfig?.compilerOptions?.moduleResolution?.toLowerCase()
        return !(moduleResolution === 'node' || pkg.engines?.node)
    }

    /**
     *
     * @private
     * @returns void
     */
    private readonly generateConfig = async (): Promise<void> => {
        const packages = this.packages.getProcessable()
            .filter(pkg => this.isRollupModule(pkg))
        const external = (id: string) => id.includes('core-js') // todo merge with this.config

        await packages.map(async pkg => (await this.getPackageOutput(pkg))
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
            .map(async ({distDir, output, currentHash, bundleName, name}) =>
                await new Loader(output, bundleName, hashFileNames && currentHash).output(distDir)))
    }

    /**
     *
     * @private
     * @returns void
     */
    private async getPackageOutput(pkg: Package): Promise<OutputOptions[]> {
        const {output, packageDir, main} = pkg

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

export const rollupCompiler = () => new Rollup()