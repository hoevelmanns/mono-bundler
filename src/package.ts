import { readJSONSync } from 'fs-extra'
import Hash from './libs/hash'
import Dependency from './dependency'
import { OutputOptions } from 'rollup'
import fileSystem from './libs/filesystem'
import { Config } from './types/config'

const path = require('path')

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
    bundles: Config.Bundle[] = []
    browser?: Browser
    dependencies: Dependency[]
    devDependencies: Dependency[]
    location: string
    distDir: string
    directories: Directories
    input: string
    hash: Hash

    /**
     * @param {string} pkgJsonFile
     */
    constructor(private readonly pkgJsonFile: string) {
        this.init()
    }

    /**
     *
     * @param {string} target
     * @param {boolean} hashFileName
     * @private
     */
    async output(target: string, hashFileName = true): Promise<OutputOptions> {
        const bundlePath = this.bundlePath(target)

        return {
            file: !hashFileName
                ? bundlePath
                : await this.hash.file(bundlePath), // no hashing in watch mode */
            format: target === Config.Target.legacy ? Config.BundleFormat.iife : Config.BundleFormat.esm, // todo,
        }
    }

    /**
     *
     * @private
     * @returns void
     */
    private init(): void {
        Object.assign(this, readJSONSync(this.pkgJsonFile))
        this.setLocation()
        this.setInput()
        this.setHash()
        this.setDistDir()
    }

    /**
     *
     * @private
     * @returns void
     */
    private setInput(): void {
        const sourcePath = this.directories?.source ?? 'src'
        const inputTS = path.join(this.location, sourcePath, 'index.ts')
        const inputJS = path.join(this.location, sourcePath, 'index.js')
        this.input = fileSystem.existsSync(inputTS) ? inputTS : fileSystem.existsSync(inputJS)? inputJS : undefined
    }

    /**
     *
     * @private
     * @returns void
     */
    private setHash(): void {
        this.hash = new Hash(this.input)
    }

    /**
     *
     * @private
     * @returns void
     */
    private setLocation(): void {
        this.location = this.pkgJsonFile.replace('/package.json', '')
    }

    /**
     *
     * @private
     * @returns void
     */
    private setDistDir(): void {
        this.distDir = path.join(this.location,
            this.main
                ? path.dirname(this.main)
                : path.join(this.location, 'dist'),
        )
    }

    /**
     *
     * @param {string} target
     */
    private bundlePath = (target: string): string => {
        const filePath = `${this.location}/${this.main}`
        return target === Config.Target.default ? filePath : fileSystem.concat(filePath, target)
    }
}
