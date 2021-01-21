"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libs_1 = require("libs");
const types_1 = require("./types");
const path = require('path');
class Loader {
    /**
     * @param {OutputOptions[]} outputs
     * @param {string} filename
     */
    constructor(outputs, filename) {
        this.outputs = outputs;
        this.filename = filename;
        this.imports = [];
        outputs.map(bundle => this.addImport(bundle));
    }
    /**
     *
     * @param {string} destPath
     * @param {string} hash
     * @returns void
     */
    output(destPath, hash) {
        const fileName = libs_1.fileSystem.concat(this.filename, ['loader', hash].filter(n => !!n).join('.'));
        libs_1.fileSystem.outputFileSync(path.join(destPath, fileName), this.imports.join(''));
    }
    /**
     *
     * @param output
     * @returns Loader
     */
    addImport(output) {
        const extName = path.extname(output.file).slice(1);
        extName === 'js' && this.imports.push(this.jsImport(output));
        // todo extName === 'css' && this.imports.push(this.cssImport(bundle))
        return this;
    }
    /**
     *
     * @param {OutputOptions} output
     * @returns string
     */
    jsImport(output) {
        const stringifiedLoaderElementAttributes = this.stringifyElementAttributes(output.name);
        return `elem = document.createElement('script');elem.src="${output.file}";${stringifiedLoaderElementAttributes}document.head.appendChild(elem);`;
    }
    /**
     *
     * @protected
     * @param {string} targetName
     */
    stringifyElementAttributes(targetName) {
        return types_1.target(targetName).LoaderElemAttributes
            .map(attr => `elem.${attr.name}=${attr.value};`);
    }
}
exports.default = Loader;
//# sourceMappingURL=loader.js.map