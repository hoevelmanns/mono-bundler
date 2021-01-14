import Dependency from './dependency'
import Package from './package'
import Logger from './libs/logger'
import * as fb from 'fast-glob'
import { Config } from './types/config'

export default class Workspace {
    packages: Package[] = []
    dependencies: Dependency[] = []
    private globs: string[] = []
    private log: Logger
    private readonly args = require('minimist')(process.argv.slice(2))

    constructor(protected readonly buildOptions: Config.BuildOptions) {
    }

    async init(): Promise<Workspace> {

        this.log = new Logger(this.options?.silent)

        this.setGlobs()

        await this.findPackages()

        await this.findDependencies()

        this.log.info(`Found ${this.packages.length} packages`)

        this.log.info(`Found ${this.dependencies.length} dependencies`)

        this.showModifiedPackages()

        return this
    }

    get modifiedPackages() {
        return this.packages.filter(pkg => pkg.isModified)
    }

    /**
     * @private
     */
    get options() {
        return { ...this.buildOptions, ...this.args }
    }

    private setGlobs() {
        const { packages } = this.buildOptions
        this.globs = Array.isArray(packages) ? packages : [packages]
    }

    /**
     * Gets the list of package json files of defined projects
     *
     * @returns void
     */
    private async findPackages(): Promise<any> {
        await Promise.all(this.globs.map(async glob => {
            const packageLocations = fb.sync(`${glob}/package.json`)
            await Promise.all(packageLocations.map(async pkgJson => await this.packages.push(await new Package(pkgJson, this.options).init())))
        }))
    }


    /**
     * Gets all dependencies of defined projects
     *
     * @returns void
     */
    private findDependencies() {
        this.packages.map(pkg =>
            this.dependencies = pkg.hasOwnProperty('dependencies')
                ? [...this.dependencies, ...Object.entries(pkg.dependencies)]
                : this.dependencies,
        )

        this.dependencies = Array
            .from(new Set(this.dependencies).values())
            .map(dep => new Dependency(dep))

    }

    /**
     *
     * @private
     * @returns void
     */
    private showModifiedPackages() {
        const { modifiedPackages } = this
        modifiedPackages.length && this.log.info('Modified packages:')
        modifiedPackages.map(pkg => this.log.yellow(`- ${pkg.name}`))
    }
}
