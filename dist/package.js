import { readJSONSync } from 'fs-extra';
import Hash from './libs/hash';
import fileSystem from './libs/filesystem';
import { Config } from './types/config';
export default class Package {
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
    async init() {
        Object.assign(this, readJSONSync(this.pkgJsonFile));
        this.setDirectories();
        if (this.shouldBeIgnored()) {
            return this;
        }
        await this.setHash();
        this.setRollupInput();
        this.setRollupOutput();
        this.isModified = this.checkIfModified();
        this.outputHashFile();
        return this;
    }
    /**
     * @private
     * @returns boolean
     */
    checkIfModified() {
        return !fileSystem.existsSync(`${this.distDir}/.${this.hash}`);
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
        const inputTS = fileSystem.join(this.sourceDir, 'index.ts');
        const inputJS = fileSystem.join(this.sourceDir, 'index.js');
        this.input = fileSystem.existsSync(inputTS) ? inputTS : fileSystem.existsSync(inputJS) ? inputJS : null;
    }
    /**
     *
     * @private
     */
    setRollupOutput() {
        if (this.buildOptions.hashFileNames) {
            this.output.push({
                name: 'default',
                file: fileSystem.join(this.packageDir, this.main),
                format: Config.Target['default'].format,
            });
        }
        Object.entries(Config.Target).map(async ([targetName, target]) => {
            const filename = fileSystem.concat(fileSystem.join(this.packageDir, this.main), target.extraFileExtension);
            this.output.push({
                name: targetName,
                file: !this.buildOptions.hashFileNames ? filename : fileSystem.concat(filename, this.hash),
                format: Config.Target[targetName.toString()].format,
            });
        });
    }
    /**
     *
     * @private
     * @returns void
     */
    async setHash() {
        this.hash = await new Hash(this.sourceDir).generate();
    }
    outputHashFile() {
        fileSystem.outputFileSync(fileSystem.join(fileSystem.dirname(fileSystem.join(this.packageDir, this.main)), '.' + this.hash), this.hash);
    }
    /**
     *
     * @private
     * @returns void
     */
    setDirectories() {
        var _a, _b, _c;
        this.packageDir = this.pkgJsonFile.replace('/package.json', '');
        this.sourceDir = fileSystem.join(this.packageDir, (_b = (_a = this.directories) === null || _a === void 0 ? void 0 : _a.source) !== null && _b !== void 0 ? _b : 'src');
        this.distDir = fileSystem.dirname(fileSystem.join(this.packageDir, (_c = this.main) !== null && _c !== void 0 ? _c : 'dist'));
    }
}
