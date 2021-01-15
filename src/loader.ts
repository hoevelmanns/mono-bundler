import { OutputOptions } from 'rollup'
import { fileSystem } from './libs'
import { Bundle, target } from './types'

const path = require('path')

export default class Loader {

    private imports: string[] = []

    /**
     * @param {OutputOptions[]} outputs
     * @param {string} filename
     */
    constructor(private readonly outputs: OutputOptions[], private filename: string) {
        outputs.map(bundle => this.addImport(bundle))
    }

    /**
     *
     * @param {string} destPath
     * @param {string} hash
     * @returns void
     */
    output(destPath: string, hash?: string): void {
        const fileName = fileSystem.concat( this.filename, ['loader', hash].filter(n => !!n).join('.'))
        fileSystem.outputFileSync(path.join(destPath, fileName), this.imports.join(''))
    }

    /**
     *
     * @param output
     * @returns Loader
     */
    addImport(output: OutputOptions): Loader {
        const extName = path.extname(output.file).slice(1)

        extName === 'js' && this.imports.push(this.jsImport(output))
        // todo extName === 'css' && this.imports.push(this.cssImport(bundle))

        return this
    }

    /**
     *
     * @param {OutputOptions} output
     * @returns string
     */
    protected jsImport(output: OutputOptions) {
        const stringifiedLoaderElementAttributes = this.stringifyElementAttributes(output.name)
        return `elem = document.createElement('script');elem.src="${output.file}";${stringifiedLoaderElementAttributes}document.head.appendChild(elem);`
    }

    /**
     *
     * @protected
     * @param {string} targetName
     */
    protected stringifyElementAttributes(targetName: string) {
        return target(targetName).LoaderElemAttributes
            .map(attr => `elem.${attr.name}=${attr.value};`)
    }

    /**
     *
     * @param {Bundle} bundle
     * @returns string
     */
    protected cssImport(bundle: Bundle) {
        // todo
    }
}


