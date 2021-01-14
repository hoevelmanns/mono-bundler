import { Config } from './types/config';
import fileSystem from './libs/filesystem';
const path = require('path');
export default class Loader {
    /**
     * @param {OutputOptions[]} outputs
     */
    constructor(outputs) {
        this.outputs = outputs;
        this.imports = [];
        outputs.map(bundle => this.addImport(bundle));
    }
    /**
     *
     * @param {string} targetPath
     * @param {string} hash
     * @param {boolean} createHashFile
     * @returns void
     */
    output(targetPath, hash, createHashFile) {
        const fileName = ['loader', hash, 'js'].filter(n => !!n).join('.');
        fileSystem.outputFileSync(path.join(targetPath, fileName), this.imports.join('')); // todo get imports file from config
    }
    /**
     *
     * @returns Loader
     * @param output
     */
    addImport(output) {
        const extName = path.extname(output.file).slice(1);
        extName === 'js' && this.imports.push(this.jsImport(output));
        // todo extName === 'css' && this.imports.push(this.cssImport(bundle))
        return this;
    }
    /**
     *
     * @returns string
     * @param {OutputOptions} output
     */
    jsImport(output) {
        const file = output.file.replace('..', ''); // todo
        const moduleAttr = Config.Target[output.name].loaderAttribute;
        return `elem = document.createElement('script');elem.src="${file}";${moduleAttr};document.head.appendChild(elem);`;
    }
    /**
     *
     * @param {Bundle} bundle
     * @returns string
     */
    cssImport(bundle) {
        // todo
    }
}
