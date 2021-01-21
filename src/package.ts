import { readJSONSync } from 'fs-extra'
import { Hash, fileSystem, Logger } from './libs'
import Dependency from './dependency'
import { OutputOptions } from 'rollup'
import { Directories, BuildOptions, getBundle, Bundles, Engines, Scripts, Bundle } from './types'
import { container, injectable } from 'tsyringe'

@injectable()
export default class Package {
	name: string
	main: string
	bundleName: string
	dependencies: Dependency[]
	devDependencies: Dependency[]
	engines: Engines
	scripts: Scripts
	tsConfigPath: string
	packageDir: string
	sourceDir: string
	distDir: string
	directories: Directories
	input: string
	output: OutputOptions[] = []
	hash: string
	isModified = false
	isIgnored = false
	private readonly log: Logger = container.resolve('Logger')
	private readonly buildOptions: BuildOptions = container.resolve('BuildOptions')
	
	/**
	 * @param {string} pkgJsonFile
	 */
	constructor(private readonly pkgJsonFile: string) {
	}
	
	/**
	 *
	 * @private
	 * @returns Package
	 */
	async init(): Promise<Package> {
		Object.assign(this, readJSONSync(this.pkgJsonFile))
		
		this.setDirectories()
		
		if (this.packageShouldBeSkipped()) {
			return this
		}
		
		this.setBundleFilename()
		
		await this.setHash()
		
		await this.setTsConfig()
		
		this.setRollupInput()
		
		this.setRollupOutput()
		
		this.checkIfModified()
		
		this.outputHashFile()
		
		return this
	}
	
	/**
	 *
	 * @private
	 */
	private setTsConfig(): void {
		const tsConfigFile = fileSystem.join(this.packageDir, 'tsconfig.json')
		this.tsConfigPath = fileSystem.existsSync(tsConfigFile) && tsConfigFile
	}
	
	/**
	 * @private
	 * @returns void
	 */
	private setBundleFilename() {
		this.bundleName = fileSystem.filename(this.main)
	}
	
	/**
	 * @private
	 * @returns void
	 */
	private checkIfModified() {
		this.isModified = [
			...this.output.map(o => fileSystem.existsSync(o.file)),
			fileSystem.existsSync(`${this.distDir}/.${this.hash}`),
		].includes(false)
	}
	
	/**
	 *
	 * @private
	 * @returns void
	 */
	private setRollupInput(): void {
		const inputTS = fileSystem.join(this.sourceDir, 'index.ts')
		const inputJS = fileSystem.join(this.sourceDir, 'index.js')
		
		this.input = fileSystem.existsSync(inputTS) ? inputTS : fileSystem.existsSync(inputJS) ? inputJS : null
	}
	
	/**
	 *
	 * @private
	 * @returns boolean
	 */
	private packageShouldBeSkipped(): boolean {
		this.isIgnored = !(this.main?.length > 0)
		this.isIgnored && this.log.error(`Package "${this.name ?? this.packageDir}" was skipped! Missing "main" field in package.json`)
		return this.isIgnored
	}
	
	/**
	 *
	 * @param {Bundle} target
	 * @private
	 */
	private targetShouldBeSkipped(target: Bundle): boolean {
		return 'legacy' === target.type && !this.buildOptions.legacyBrowserSupport
	}
	
	/**
	 *
	 * @private
	 * @param {Bundle} bundle
	 * @returns string
	 */
	private generateOutputFilename(bundle: Bundle): string {
		const filename = fileSystem.concat(fileSystem.join(this.packageDir, this.main), bundle.extraFileExtension)
		return !this.buildOptions.hashFileNames ? filename : fileSystem.concat(filename, this.hash)
	}
	
	/**
	 *
	 * @private
	 * @returns void
	 */
	setRollupOutput(): void {
		this.buildOptions.hashFileNames && this.output.push({
			name: 'default',
			file: fileSystem.join(this.packageDir, this.main),
			format: getBundle('default').format,
		})
		
		Bundles
			.filter(target => !this.targetShouldBeSkipped(target))
			.map(async target => {
				
				this.output.push({
					name: target.type,
					file: this.generateOutputFilename(target),
					format: target.format,
				})
			})
	}
	
	/**
	 *
	 * @private
	 * @returns void
	 */
	private async setHash(): Promise<void> {
		this.hash = await new Hash(this.sourceDir).generate()
	}
	
	/**
	 * @private
	 * @returns void
	 */
	private outputHashFile() {
		fileSystem.outputFileSync(fileSystem.join(fileSystem.dirname(fileSystem.join(this.packageDir, this.main)), '.' + this.hash), this.hash)
	}
	
	/**
	 *
	 * @private
	 * @returns void
	 */
	private setDirectories(): void {
		this.packageDir = this.pkgJsonFile.replace('/package.json', '')
		this.sourceDir = fileSystem.join(this.packageDir, this.directories?.source ?? 'src')
		this.distDir = fileSystem.dirname(fileSystem.join(this.packageDir, this.main ?? 'dist'))
	}
}
