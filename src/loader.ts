import { Config } from './types/config'
import { outputFileSync } from 'fs-extra'

const path = require('path')

export default class Loader {

    private imports: string[] = []

    /**
     * @param {Bundle[]} bundles
     */
    constructor(private bundles: Config.Bundle[]) {
        bundles.map(bundle => this.addImport(bundle))
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

        outputFileSync(path.join(targetPath, fileName), this.imports.join('')) // todo get imports file from config
        outputFileSync(path.join(targetPath, '.hash'), hash)
    }

    /**
     *
     * @param {Bundle} bundle
     * @returns Loader
     */
    addImport(bundle: Config.Bundle): Loader {
        const extName = path.extname(bundle.file).slice(1)

        extName === 'js' && this.imports.push(this.jsImport(bundle))
        // todo extName === 'css' && this.imports.push(this.cssImport(bundle))

        return this
    }

    /**
     *
     * @param {Bundle} bundle
     * @returns string
     */
    protected jsImport(bundle: Config.Bundle) {
        const file = bundle.file.replace('..', '') // todo
        const moduleAttr = bundle.target === Config.Target.legacy ? `elem.noModule=true` : `elem.type="module"`

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


