"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const tsyringe_1 = require("tsyringe");
let Package = class Package {
    /**
     * @param {string} pkgJsonFile
     */
    constructor(pkgJsonFile) {
        this.pkgJsonFile = pkgJsonFile;
        this.output = [];
        this.isModified = false;
        this.isIgnored = false;
        this.log = tsyringe_1.container.resolve('Logger');
        this.buildOptions = tsyringe_1.container.resolve('BuildOptions');
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
            if (this.packageShouldBeSkipped()) {
                return this;
            }
            this.setBundleFilename();
            yield this.setHash();
            yield this.setTsConfig();
            this.setRollupInput();
            this.setRollupOutput();
            this.checkIfModified();
            this.outputHashFile();
            return this;
        });
    }
    /**
     *
     * @private
     */
    setTsConfig() {
        const tsConfigFile = libs_1.fileSystem.join(this.packageDir, 'tsconfig.json');
        this.tsConfigPath = libs_1.fileSystem.existsSync(tsConfigFile) && tsConfigFile;
    }
    /**
     * @private
     * @returns void
     */
    setBundleFilename() {
        this.bundleName = libs_1.fileSystem.filename(this.main);
    }
    /**
     * @private
     * @returns void
     */
    checkIfModified() {
        this.isModified = [
            ...this.output.map(o => libs_1.fileSystem.existsSync(o.file)),
            libs_1.fileSystem.existsSync(`${this.distDir}/.${this.hash}`),
        ].includes(false);
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
     * @returns boolean
     */
    packageShouldBeSkipped() {
        var _a, _b;
        this.isIgnored = !(((_a = this.main) === null || _a === void 0 ? void 0 : _a.length) > 0);
        this.isIgnored && this.log.error(`Package "${(_b = this.name) !== null && _b !== void 0 ? _b : this.packageDir}" was skipped! Missing "main" field in package.json`);
        return this.isIgnored;
    }
    /**
     *
     * @param {Bundle} target
     * @private
     */
    targetShouldBeSkipped(target) {
        return 'legacy' === target.type && !this.buildOptions.legacyBrowserSupport;
    }
    /**
     *
     * @private
     * @param {Bundle} bundle
     * @returns string
     */
    generateOutputFilename(bundle) {
        const filename = libs_1.fileSystem.concat(libs_1.fileSystem.join(this.packageDir, this.main), bundle.extraFileExtension);
        return !this.buildOptions.hashFileNames ? filename : libs_1.fileSystem.concat(filename, this.hash);
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
            format: types_1.getBundle('default').format,
        });
        types_1.Bundles
            .filter(target => !this.targetShouldBeSkipped(target))
            .map((target) => __awaiter(this, void 0, void 0, function* () {
            this.output.push({
                name: target.type,
                file: this.generateOutputFilename(target),
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
};
Package = __decorate([
    tsyringe_1.injectable()
], Package);
exports.default = Package;
