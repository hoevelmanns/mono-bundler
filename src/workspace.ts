import Dependency from './dependency'
import Package from './package'
import { Logger } from './libs'
import * as fb from 'fast-glob'
import { BuildOptions } from './types'
import { container } from 'tsyringe'

export default class Workspace {
    packages: Package[] = []
    dependencies: (Dependency | [string, unknown])[] = []
    private globs: string[] = []
    protected readonly log: Logger = container.resolve('Logger')
    protected readonly buildOptions: BuildOptions = container.resolve('BuildOptions')

    async init(): Promise<Workspace> {

        this.setGlobs()

        await this.findPackages()

        await this.findDependencies()

        this.showReport()

        return this
    }

    /**
     * @returns Package[]
     */
    get modifiedPackages(): Package[] {
        return this.packages.filter(pkg => pkg.isModified)
    }

    /**
     * @returns boolean
     */
    get hasModifiedPackages(): boolean {
        return this.modifiedPackages.length > 0
    }


    /**
     *
     * @private
     * @returns void
     */
    private setGlobs(): void {
        const { packages } = this.buildOptions
        this.globs = Array.isArray(packages) ? packages : [packages]
    }

    /**
     * Gets the list of package json files of defined projects
     *
     * @returns Promise<void>
     */
    private async findPackages(): Promise<void> {
        await Promise.all(this.globs.map(async glob => {
            const packageLocations = fb.sync(`${glob}/package.json`)
            await Promise.all(packageLocations.map(async pkgJson => await this.packages.push(await new Package(pkgJson).init())))
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
            .map(dep => new Dependency(<string[]>dep))
    }

    /**
     *
     * @private
     * @returns void
     */
    private showReport(): void {
        const { modifiedPackages, packages, dependencies } = this

        this.log.info(`Found packages: ${packages.length}`)
        this.log.info(`Found dependencies: ${dependencies.length}`)

        modifiedPackages.length && this.log.info('Modified packages:')
        modifiedPackages.map(pkg => this.log.yellow(`- ${pkg.name}`))
    }
}
