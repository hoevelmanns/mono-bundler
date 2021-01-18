"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const libs_1 = require("./libs");
const types_1 = require("./types");
class Package {
    /**
     * @param {string} pkgJsonFile
     * @param {BuildOptions} buildOptions
     */
    constructor(pkgJsonFile, buildOptions) {
        this.pkgJsonFile = pkgJsonFile;
        this.buildOptions = buildOptions;
        this.output = [];
        this.isModified = false;
        this.isIgnored = false;
        this.log = new libs_1.Logger(this.buildOptions.silent);
    }
    /**
     *
     * @private
     * @returns Package
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            Object.assign(this, fs_extra_1.readJSONSync(this.pkgJsonFile));
            this.setDirectories();
            if (this.shouldBeIgnored()) {
                return this;
            }
            this.setBundleFilename();
            yield this.setHash();
            this.setRollupInput();
            this.setRollupOutput();
            this.checkIfModified();
            this.outputHashFile();
            return this;
        });
    }
    /**
     * @private
     * @returns void
     */
    setBundleFilename() {
        this.bundleFilename = libs_1.fileSystem.filename(this.main);
    }
    /**
     * @private
     * @returns boolean
     */
    checkIfModified() {
        this.isModified = !libs_1.fileSystem.existsSync(`${this.distDir}/.${this.hash}`);
        return this.isModified;
    }
    /**
     *
     * @private
     * @returns boolean
     */
    shouldBeIgnored() {
        var _a, _b;
        this.isIgnored = !(((_a = this.main) === null || _a === void 0 ? void 0 : _a.length) > 0);
        this.isIgnored && this.log.error(`Package "${(_b = this.name) !== null && _b !== void 0 ? _b : this.packageDir}" was skipped! Missing "main" field in package.json`);
        return this.isIgnored;
    }
    /**
     *
     * @private
     * @returns void
     */
    setRollupInput() {
        const inputTS = libs_1.fileSystem.join(this.sourceDir, 'index.ts');
        const inputJS = libs_1.fileSystem.join(this.sourceDir, 'index.js');
        this.input = libs_1.fileSystem.existsSync(inputTS) ? inputTS : libs_1.fileSystem.existsSync(inputJS) ? inputJS : null;
    }
    /**
     *
     * @private
     * @returns void
     */
    setRollupOutput() {
        this.buildOptions.hashFileNames && this.output.push({
            name: 'default',
            file: libs_1.fileSystem.join(this.packageDir, this.main),
            format: types_1.target('default').format,
        });
        types_1.Targets.map((target) => __awaiter(this, void 0, void 0, function* () {
            const filename = libs_1.fileSystem.concat(libs_1.fileSystem.join(this.packageDir, this.main), target.extraFileExtension);
            if ('legacy' === target.type && !this.buildOptions.legacyBrowserSupport) {
                return;
            }
            this.output.push({
                name: target.type,
                file: !this.buildOptions.hashFileNames ? filename : libs_1.fileSystem.concat(filename, this.hash),
                format: target.format,
            });
        }));
    }
    /**
     *
     * @private
     * @returns void
     */
    setHash() {
        return __awaiter(this, void 0, void 0, function* () {
            this.hash = yield new libs_1.Hash(this.sourceDir).generate();
        });
    }
    /**
     * @private
     * @returns void
     */
    outputHashFile() {
        libs_1.fileSystem.outputFileSync(libs_1.fileSystem.join(libs_1.fileSystem.dirname(libs_1.fileSystem.join(this.packageDir, this.main)), '.' + this.hash), this.hash);
    }
    /**
     *
     * @private
     * @returns void
     */
    setDirectories() {
        var _a, _b, _c;
        this.packageDir = this.pkgJsonFile.replace('/package.json', '');
        this.sourceDir = libs_1.fileSystem.join(this.packageDir, (_b = (_a = this.directories) === null || _a === void 0 ? void 0 : _a.source) !== null && _b !== void 0 ? _b : 'src');
        this.distDir = libs_1.fileSystem.dirname(libs_1.fileSystem.join(this.packageDir, (_c = this.main) !== null && _c !== void 0 ? _c : 'dist'));
    }
}
exports.default = Package;
//# sourceMappingURL=package.js.map