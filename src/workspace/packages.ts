import { autoInjectable, container, inject, singleton } from 'tsyringe'
import Dependency from './dependency'
import { Options } from './options'
import { Package } from './package'
import { Logger } from 'shared'
import { existsSync } from 'fs'
import { sync } from 'fast-glob'

@singleton()
@autoInjectable()
export class Packages {
	private processablePackages: Package[] = []
	private ignoredPackages: Package[] = []
	private _dependencies: (Dependency | [string, unknown])[] = []
	
	constructor(
		@inject('Options') private readonly options?: Options,
		@inject('Logger') private readonly logger?: Logger,
	) {
	}
	
	async init(): Promise<Packages> {
		await this.findPackages()
		await this.findDependencies()
		this.showReport()
		return this
	}
	
	/**
	 *
	 * @param {string} moduleName
	 * @returns Package
	 */
	get(moduleName: string): Package {
		return this.processablePackages
			.filter(p => p.name === moduleName)
			.shift()
	}
	
	/**
	 * @returns Package[]
	 */
	getProcessable = (): Package[] => this.processablePackages
	
	/**
	 * @returns Package[]
	 */
	getIgnored = (): Package[] => this.ignoredPackages
	
	/**
	 * @returns number
	 */
	get count(): number {
		return this.processablePackages.length
	}
	
	/**
	 * @returns {Dependency[]}
	 */
	get dependencies(): Dependency[] {
		return <Dependency[]>this._dependencies
	}
	
	/**
	 * @returns Package[]
	 */
	get modified(): Package[] {
		return this.processablePackages.filter(pkg => pkg.isModified)
	}
	
	/**
	 * @returns boolean
	 */
	get hasModifiedPackages(): boolean {
		return this.modified.length > 0
	}
	
	/**
	 * Gets the list of package json files of defined projects
	 *
	 * @returns Promise<void>
	 */
	private async findPackages(): Promise<void> {
		const globs = this.options.packages
		
		await Promise.all(globs.map(async glob => {
			const packageLocations = sync(`${glob}/package.json`)
			
			await Promise.all(packageLocations.map(async pkgJsonPath => {
				const pkg = new Package(pkgJsonPath)
				
				this.packageShouldBeIgnored(pkg)
					? this.addToIgnored(pkg)
					: await pkg.generateHash() && pkg.isModified && await this.addToProcessable(pkg)
			}))
		}))
	}
	
	/**
	 * Gets all dependencies of defined projects
	 *
	 * @returns void
	 */
	private findDependencies() {
		this.processablePackages.map(pkg =>
			this._dependencies = pkg.hasOwnProperty('dependencies')
				? [...this._dependencies, ...Object.entries(pkg.dependencies)]
				: this._dependencies,
		)
		
		this._dependencies = Array
			.from(new Set(this._dependencies).values())
			.map(dep => new Dependency(<string[]>dep))
	}
	
	/**
	 *
	 * @param {Package} pkg
	 */
	private addToProcessable = (pkg: Package): number => this.processablePackages.push(pkg)
	
	/**
	 *
	 * @param {Package} pkg
	 */
	private addToIgnored = (pkg: Package): number => this.ignoredPackages.push(pkg)
	
	/**
	 *
	 * @private
	 * @returns boolean
	 */
	private packageShouldBeIgnored = (pkg: Package): boolean =>
		!pkg.main?.length
		|| !existsSync(pkg.sourceDir)
		|| pkg.isExcluded
	
	
	/**
	 * @private
	 * @returns void
	 */
	private showReport() {
		const { count, dependencies } = this
		this.logger.info(`Found packages: ${count}`)
		this.logger.info(`Found dependencies: ${dependencies.length}\n`)
	}
}

export const packages = async () => container.register<Packages>('Packages', { useValue: await new Packages().init() })