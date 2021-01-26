import { readJSONSync, writeJsonSync } from 'fs-extra'
import Dependency from './dependency'
import { OutputOptions } from 'rollup'
import { Logger, PackageHash } from 'shared'
import { Directories, Engines, Scripts, TsConfig } from './types'
import { autoInjectable, inject } from 'tsyringe'
import { Options } from './options'
import { existsSync } from 'fs'
import path from 'path'
import { filename } from '../shared/filesystem'

@autoInjectable()
export class Package {
	name: string
	main: string
	bundleName: string
	dependencies: Dependency[]
	engines: Engines
	scripts: Scripts
	tsConfigPath: string
	tsConfig: TsConfig
	packageDir: string
	sourceDir: string
	distDir: string
	input: string
	output: OutputOptions[] = []
	currentHash: string
	packageHash: string
	isIgnored = false
	config: { hash: string }
	private directories: Directories
	
	// todo isModule = false
	
	/**
	 * @param {string} pkgJsonFile
	 * @param {Options} options
	 * @param {Logger} log
	 */
	constructor(
		protected readonly pkgJsonFile: string,
		@inject('Options') protected readonly options?: Options,
		@inject('Logger') protected readonly log?: Logger,
	) {
		Object.assign(this, readJSONSync(this.pkgJsonFile))
		this.setDirectories()
		this.setBundleFilename()
		this.setTsConfig()
	}
	
	/**
	 *
	 * @private
	 * @returns boolean
	 */
	get isExcluded() {
		return this.options.exclude
			.filter(ex => this.packageDir.includes(ex))
			.length > 0
	}
	
	/**
	 *
	 * @private
	 * @returns void
	 */
	async generateHash(): Promise<string> {
		this.currentHash = await new PackageHash(this.packageDir).generate()
		return this.currentHash
	}
	
	
	/**
	 * @private
	 * @returns void
	 */
	async updateHash(): Promise<void> {
		const pkgJson = readJSONSync(this.pkgJsonFile)
		const hash = this.currentHash
		
		pkgJson.config = pkgJson.config
			? { ...pkgJson.config, ...{ hash } }
			: { hash }
		
		writeJsonSync(this.pkgJsonFile, pkgJson, { spaces: '\t' })
	}
	
	/**
	 * @returns boolean
	 */
	get isModified(): boolean {
		return this.currentHash !== this.config?.hash
			|| !existsSync(path.join(this.packageDir, this.main))
	}
	
	/**
	 *
	 * @private
	 */
	private setTsConfig(): void {
		const tsConfigFile = path.join(this.packageDir, 'tsconfig.json')
		this.tsConfigPath = existsSync(tsConfigFile) && tsConfigFile
		this.tsConfig = this.tsConfigPath && readJSONSync(this.tsConfigPath)
	}
	
	/**
	 * @private
	 * @returns void
	 */
	private setBundleFilename = () => this.bundleName = filename(this.main)
	
	
	/**
	 *
	 * @private
	 * @returns void
	 */
	private setDirectories(): void {
		this.packageDir = this.pkgJsonFile.replace('/package.json', '')
		this.sourceDir = path.join(this.packageDir, this.directories?.source ?? 'src')
		this.distDir = path.dirname(path.join(this.packageDir, this.main ?? 'dist'))
	}
}
