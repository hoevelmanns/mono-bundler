import {autoInjectable, container, inject} from "tsyringe"
import Dependency from "./dependency"
import * as fb from "fast-glob"
import {Options} from "./options"
import { Package } from './package'

@autoInjectable()
export class Packages {
    protected packages: Package[] = []
    protected _dependencies: (Dependency | [string, unknown])[] = []

    constructor(
        @inject('Options') private options?: Options) {
    }

    async init(): Promise<Packages> {
        await this.findPackages()
        await this.findDependencies()
        return this
    }

    /**
     *
     * @param {string} pkjJsonPath - path of the package.json
     */
    private async add(pkjJsonPath: string) {
        this.packages.push(await new Package(pkjJsonPath).init())
    }

    /**
     * @returns number
     */
    get count(): number {
        return this.packages.length
    }

    /**
     * @returns {Dependency[]}
     */
    get dependencies(): Dependency[] {
        return <Dependency[]>this._dependencies
    }

    /**
     * Gets the list of package json files of defined projects
     *
     * @returns Promise<void>
     */
    private async findPackages(): Promise<void> {
        const globs = this.options.packages
        await Promise.all(globs.map(async glob => {
            const packageLocations = fb.sync(`${glob}/package.json`)
            await Promise.all(packageLocations.map(async pkgJsonPath => await this.add(pkgJsonPath)))
        }))
    }

    /**
     * Gets all dependencies of defined projects
     *
     * @returns void
     */
    private findDependencies() {
        this.packages.map(pkg =>
            this._dependencies = pkg.hasOwnProperty('dependencies')
                ? [...this._dependencies, ...Object.entries(pkg.dependencies)]
                : this._dependencies,
        )

        this._dependencies = Array
            .from(new Set(this._dependencies).values())
            .map(dep => new Dependency(<string[]>dep))
    }

    /**
     * @returns Package[]
     */
    get processable(): Package[] {
        return this.packages.filter(pkg => !pkg.isIgnored)
    }

    /**
     * @returns Package[]
     */
    get modified(): Package[] {
        return this.packages.filter(pkg => pkg.isModified)
    }


    /**
     * @returns boolean
     */
    get hasModifiedPackages(): boolean {
        return this.modified.length > 0
    }

}

export const packages = async () => container.register<Packages>('Packages', {useValue: await new Packages().init()})