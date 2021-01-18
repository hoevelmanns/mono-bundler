import { OutputOptions } from 'rollup'
import { fileSystem } from './libs'
import { Bundle, target } from './types'

export default class Loader {

    private imports: string[] = []

    /**
     * @param {OutputOptions[]} outputs
     * @param {string} filename
     * @param {string} hash
     */
    constructor(private readonly outputs: OutputOptions[], private filename: string, private hash?: string) {
        outputs.map(outputOption => {
            const ignoreLoader = 'default' === outputOption.name && this.hash && !outputOption.file.includes(this.hash)

            !ignoreLoader && this.addImport(outputOption)
        })
    }

    /**
     *
     * @param {string} destPath
     * @returns void
     */
    output(destPath: string): void {
        const fileName = fileSystem.concat(this.filename, ['loader', this.hash].filter(n => !!n).join('.'))
        fileSystem.outputFileSync(fileSystem.join(destPath, fileName), this.imports.join(''))
    }

    /**
     *
     * @param output
     * @returns Loader
     */
    addImport(output: OutputOptions): Loader {
        const extName = fileSystem.extname(output.file).slice(1)

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


