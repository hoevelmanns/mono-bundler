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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const hash_1 = __importDefault(require("./libs/hash"));
const filesystem_1 = __importDefault(require("./libs/filesystem"));
const config_1 = require("./types/config"); // todo
class Package {
    /**
     * @param {string} pkgJsonFile
     * @param {Config.BuildOptions} buildOptions
     */
    constructor(pkgJsonFile, buildOptions) {
        this.pkgJsonFile = pkgJsonFile;
        this.buildOptions = buildOptions;
        this.output = [];
        this.isModified = false;
        this.isIgnored = false;
    }
    /**
     *
     * @private
     * @returns void
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            Object.assign(this, fs_extra_1.readJSONSync(this.pkgJsonFile));
            this.setDirectories();
            if (this.shouldBeIgnored()) {
                return this;
            }
            yield this.setHash();
            this.setRollupInput();
            this.setRollupOutput();
            this.isModified = this.checkIfModified();
            this.outputHashFile();
            return this;
        });
    }
    /**
     * @private
     * @returns boolean
     */
    checkIfModified() {
        return !filesystem_1.default.existsSync(`${this.distDir}/.${this.hash}`);
    }
    shouldBeIgnored() {
        return this.isIgnored = !this.main;
    }
    /**
     *
     * @private
     * @returns void
     */
    setRollupInput() {
        const inputTS = filesystem_1.default.join(this.sourceDir, 'index.ts');
        const inputJS = filesystem_1.default.join(this.sourceDir, 'index.js');
        this.input = filesystem_1.default.existsSync(inputTS) ? inputTS : filesystem_1.default.existsSync(inputJS) ? inputJS : null;
    }
    /**
     *
     * @private
     */
    setRollupOutput() {
        if (this.buildOptions.hashFileNames) {
            this.output.push({
                name: 'default',
                file: filesystem_1.default.join(this.packageDir, this.main),
                format: config_1.Config.Target['default'].format,
            });
        }
        Object.entries(config_1.Config.Target).map(([targetName, target]) => __awaiter(this, void 0, void 0, function* () {
            const filename = filesystem_1.default.concat(filesystem_1.default.join(this.packageDir, this.main), target.extraFileExtension);
            this.output.push({
                name: targetName,
                file: !this.buildOptions.hashFileNames ? filename : filesystem_1.default.concat(filename, this.hash),
                // @ts-ignore todo
                format: config_1.Config.Target[targetName.toString()].format,
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
            this.hash = yield new hash_1.default(this.sourceDir).generate();
        });
    }
    outputHashFile() {
        filesystem_1.default.outputFileSync(filesystem_1.default.join(filesystem_1.default.dirname(filesystem_1.default.join(this.packageDir, this.main)), '.' + this.hash), this.hash);
    }
    /**
     *
     * @private
     * @returns void
     */
    setDirectories() {
        var _a, _b, _c;
        this.packageDir = this.pkgJsonFile.replace('/package.json', '');
        this.sourceDir = filesystem_1.default.join(this.packageDir, (_b = (_a = this.directories) === null || _a === void 0 ? void 0 : _a.source) !== null && _b !== void 0 ? _b : 'src');
        this.distDir = filesystem_1.default.dirname(filesystem_1.default.join(this.packageDir, (_c = this.main) !== null && _c !== void 0 ? _c : 'dist'));
    }
}
exports.default = Package;
//# sourceMappingURL=package.js.map