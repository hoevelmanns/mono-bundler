import { readJSONSync } from 'fs-extra'
import { Hash, fileSystem} from './libs'
import Dependency from './dependency'
import { OutputOptions } from 'rollup'
import { Browser, Directories, BuildOptions, target, Targets  } from './types'

export default class Package {
    name: string
    main: string
    bundleFilename: string
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
     * @param {BuildOptions} buildOptions
     */
    constructor(private readonly pkgJsonFile: string, protected buildOptions: BuildOptions) {
    }

    /**
     *
     * @private
     * @returns Package
     */
    async init(): Promise<Package> {
        Object.assign(this, readJSONSync(this.pkgJsonFile))

        this.setDirectories()

        if (this.shouldBeIgnored()) {
            return this
        }

        this.setBundleFilename()

        await this.setHash()

        this.setRollupInput()

        this.setRollupOutput()

        this.checkIfModified()

        this.outputHashFile()

        return this
    }

    /**
     * @private
     * @returns void
     */
    private setBundleFilename() {
        this.bundleFilename = fileSystem.filename(this.main)
    }

    /**
     * @private
     * @returns boolean
     */
    private checkIfModified() {
        this.isModified = !fileSystem.existsSync(`${this.distDir}/.${this.hash}`)
        return this.isModified
    }

    /**
     *
     * @private
     * @returns boolean
     */
    private shouldBeIgnored() {
        // todo message
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
     * @returns void
     */
    setRollupOutput(): void {
        this.buildOptions.hashFileNames && this.output.push({
            name: 'default',
            file: fileSystem.join(this.packageDir, this.main),
            format: target('default').format,
        })

        !this.buildOptions.watch && Targets.map(async (target) => {
            const filename = fileSystem.concat(fileSystem.join(this.packageDir, this.main), target.extraFileExtension)

            this.output.push({
                name: target.type,
                file: !this.buildOptions.hashFileNames ? filename : fileSystem.concat(filename, this.hash),
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
