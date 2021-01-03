import Dependency from './dependency'
import Package from './package'
import Logger from './libs/logger'
import * as fb from 'fast-glob'
import { Config } from './types/config'

export default class Workspace {
    globs: string[] = []
    packages: Package[] = []
    silent = false
    dependencies: Dependency[] = []
    log: Logger


    constructor(private readonly options: Config.BuildOptions) {

        this.log = new Logger(options?.silent)
        this.setGlobs()
        this.findPackages()
        this.findDependencies()

        this.log.info(`Found ${this.packages.length} packages`)
        this.log.info(`Found ${this.dependencies.length} dependencies`)
    }

    setGlobs() {
        const { packages } = this.options
        this.globs = Array.isArray(packages) ? packages : [packages]
    }

    /**
     * Gets the list of package json files of defined projects
     *
     * @returns void
     */
    findPackages(): void {
        this.globs.map(glob => {
            const packageLocations = fb.sync(`${glob}/package.json`)
            packageLocations.map(pkgJson => this.packages.push(new Package(pkgJson)))
        })
    }


    /**
     * Gets all dependencies of defined projects
     *
     * @returns void
     */
    findDependencies() {
        this.packages.map(pkg =>
            this.dependencies = pkg.hasOwnProperty('dependencies')
                ? [...this.dependencies, ...Object.entries(pkg.dependencies)]
                : this.dependencies,
        )

        this.dependencies = Array
            .from(new Set(this.dependencies).values())
            .map(dep => new Dependency(dep))

    }
}
