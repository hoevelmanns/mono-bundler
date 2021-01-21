"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libs_1 = require("./libs");
const types_1 = require("./types");
class Loader {
    /**
     * @param {OutputOptions[]} outputs
     * @param {string} filename
     * @param {string} hash
     */
    constructor(outputs, filename, hash) {
        this.outputs = outputs;
        this.filename = filename;
        this.hash = hash;
        this.imports = [];
        outputs
            .map(outputOption => !this.louderShouldBeSkipped(outputOption) && this.addImport(outputOption));
    }
    /**
     *
     * @param {string} destPath
     * @returns void
     */
    output(destPath) {
        const fileName = libs_1.fileSystem.concat(this.filename, ['loader', this.hash].filter(n => !!n).join('.'));
        libs_1.fileSystem.outputFileSync(libs_1.fileSystem.join(destPath, fileName), this.imports.join(''));
    }
    /**
     *
     * @param output
     * @returns Loader
     */
    addImport(output) {
        const extName = libs_1.fileSystem.extname(output.file).slice(1);
        extName === 'js' && this.imports.push(this.jsImport(output));
        // todo extName === 'css' && this.imports.push(this.cssImport(bundle))
        return this;
    }
    /**
     * @private
     * @param {OutputOptions} outputOption
     * @returns boolean
     */
    louderShouldBeSkipped(outputOption) {
        return 'default' === outputOption.name && this.hash && !outputOption.file.includes(this.hash);
    }
    /**
     *
     * @param {OutputOptions} output
     * @returns string
     */
    jsImport(output) {
        return `elem = document.createElement('script');
                elem.src="${output.file}";
                ${this.stringifyElementAttributes(output.name)}document.head.appendChild(elem);`;
    }
    /**
     *
     * @protected
     * @returns string[]
     */
    stringifyElementAttributes(bundleName) {
        return types_1.getBundle(bundleName).LoaderElemAttributes
            .map(attr => `elem.${attr.name}=${attr.value};`);
    }
}
exports.default = Loader;
//# sourceMappingURL=loader.js.map