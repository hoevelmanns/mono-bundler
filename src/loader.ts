import { OutputOptions } from 'rollup'
import fileSystem from './libs/filesystem'
import { Config } from './types/config'

const path = require('path')

export default class Loader {

    private imports: string[] = []

    /**
     * @param {OutputOptions[]} outputs
     */
    constructor(private outputs: OutputOptions[]) {
        outputs.map(bundle => this.addImport(bundle))
    }

    /**
     *
     * @param {string} targetPath
     * @param {string} hash
     * @param {boolean} createHashFile
     * @returns void
     */
    output(targetPath: string, hash?: string, createHashFile?: boolean): void {
        const fileName = ['loader', hash, 'js'].filter(n => !!n).join('.')
        fileSystem.outputFileSync(path.join(targetPath, fileName), this.imports.join('')) // todo get imports file from config
    }

    /**
     *
     * @returns Loader
     * @param output
     */
    addImport(output: OutputOptions): Loader {
        const extName = path.extname(output.file).slice(1)

        extName === 'js' && this.imports.push(this.jsImport(output))
        // todo extName === 'css' && this.imports.push(this.cssImport(bundle))

        return this
    }

    /**
     *
     * @returns string
     * @param {OutputOptions} output
     */
    protected jsImport(output: OutputOptions) {
        const file = output.file.replace('..', '') // todo
        // @ts-ignore todo
        const moduleAttr = Config.Target[output.name].loaderAttribute

        return `elem = document.createElement('script');elem.src="${file}";${moduleAttr};document.head.appendChild(elem);`
    }

    /**
     *
     * @param {Bundle} bundle
     * @returns string
     */
    protected cssImport(bundle: Config.Bundle) {
        // todo
    }
}


