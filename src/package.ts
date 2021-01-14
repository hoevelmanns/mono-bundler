import { readJSONSync } from 'fs-extra'
import Hash from './libs/hash'
import Dependency from './dependency'
import { OutputOptions } from 'rollup'
import fileSystem from './libs/filesystem'
import { Config } from './types/config'

interface Browser {
    umd?: string,
    esm?: string
}

interface Directories {
    source?: string
}

export default class Package {
    name: string
    main: string
    browser?: Browser
    dependencies: Dependency[]
    devDependencies: Dependency[]
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
     * @param {Config.BuildOptions} buildOptions
     */
    constructor(private readonly pkgJsonFile: string, protected buildOptions: Config.BuildOptions) {
    }

    /**
     *
     * @private
     * @returns void
     */
    async init(): Promise<Package> {
        Object.assign(this, readJSONSync(this.pkgJsonFile))

        this.setDirectories()

        if (this.shouldBeIgnored()) {
            return this
        }

        await this.setHash()

        this.setRollupInput()

        this.setRollupOutput()

        this.isModified = this.checkIfModified()

        this.outputHashFile()

        return this
    }

    /**
     * @private
     * @returns boolean
     */
    private checkIfModified() {
        return !fileSystem.existsSync(`${this.distDir}/.${this.hash}`)
    }

    private shouldBeIgnored() {
        return this.isIgnored = !this.main
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
     */
    setRollupOutput(): void {
        if (this.buildOptions.hashFileNames) {
            this.output.push({
                name: 'default',
                file: fileSystem.join(this.packageDir, this.main),
                format: Config.Target['default'].format,
            })
        }

        Object.entries(Config.Target).map(async ([targetName, target]) => {
            const filename = fileSystem.concat(fileSystem.join(this.packageDir, this.main), target.extraFileExtension)
            this.output.push({
                name: targetName,
                file: !this.buildOptions.hashFileNames ? filename : fileSystem.concat(filename, this.hash),
                format: Config.Target[targetName.toString()].format,
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

    outputHashFile() {
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
