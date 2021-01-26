import {readJSONSync} from 'fs-extra'
import Dependency from './dependency'
import {OutputOptions} from 'rollup'
import {Logger, fileSystem, Hash} from 'shared'
import {Directories, Engines, Scripts, TsConfig} from './types'
import {autoInjectable, inject} from 'tsyringe'
import {Options} from "./options"

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
    directories: Directories
    input: string
    output: OutputOptions[] = []
    hash: string
    isModified = false
    isIgnored = false

    /**
     * @param {string} pkgJsonFile
     * @param {Options} options
     * @param {Logger} log
     */
    constructor(
        protected readonly pkgJsonFile: string,
        @inject('Options') protected readonly options?: Options,
        @inject('Logger') protected readonly log?: Logger
    ) {
    }

    /**
     *
     * @private
     * @returns Package
     */
    async init(): Promise<Package> {
        Object.assign(this, readJSONSync(this.pkgJsonFile))

        this.setDirectories()

        if (this.shouldBeSkipped()) {
            return Promise.resolve(this)
        }

        this.setBundleFilename()

        await this.setHash()

        await this.setTsConfig()

        this.setRollupInput()

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
        if (this.tsConfigPath) {
            this.tsConfig = readJSONSync(this.tsConfigPath)
        }
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
    private checkIfModified(): void {
        this.isModified = [
            ...this.output.map(o => fileSystem.existsSync(o.file)),
            fileSystem.existsSync(`${this.distDir}/.${this.hash}`),
        ].includes(false)
    }

    /**
     *
     * @private
     * @returns boolean
     */
    private get isExcluded() {
        return this.options.exclude.filter(ex => this.packageDir.includes(ex)).length > 0
    }

    /**
     *
     * @private
     * @returns boolean
     */
    private shouldBeSkipped(): boolean {
        this.isIgnored = !this.main?.length || !fileSystem.existsSync(this.sourceDir)

        if (this.isExcluded) {
            this.isIgnored = true
            return this.isIgnored
        }

        this.isIgnored && this.log.error(`Package "${this.name ?? this.packageDir}" was skipped! Missing "main" field in package.json`)
        return this.isIgnored
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
     * @returns void
     */
    private async setHash(): Promise<void> {
        this.hash = await new Hash(this.sourceDir).generate()
    }

    /**
     * @private
     * @returns void
     */
    private outputHashFile(): void {
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
