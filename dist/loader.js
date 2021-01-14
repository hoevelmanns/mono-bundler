"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const filesystem_1 = __importDefault(require("./libs/filesystem"));
const config_1 = require("./types/config");
const path = require('path');
class Loader {
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
        filesystem_1.default.outputFileSync(path.join(targetPath, fileName), this.imports.join('')); // todo get imports file from config
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
        // @ts-ignore todo
        const moduleAttr = config_1.Config.Target[output.name].loaderAttribute;
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
exports.default = Loader;
//# sourceMappingURL=loader.js.map