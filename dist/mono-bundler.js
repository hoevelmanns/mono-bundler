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
exports.MonoBundler = void 0;
const workspace_1 = __importDefault(require("./workspace"));
const logger_1 = __importDefault(require("./libs/logger"));
const plugins_1 = __importDefault(require("./plugins"));
const loader_1 = __importDefault(require("./loader"));
class MonoBundler {
    /**
     *
     * @param {Config.BuildOptions} buildOptions
     */
    constructor(buildOptions) {
        this.buildOptions = buildOptions;
        this.rollupConfigurations = [];
        this.workspace = new workspace_1.default(this.buildOptions);
        this.plugins = new plugins_1.default(this.buildOptions);
        this.log = new logger_1.default(this.buildOptions.silent);
        this.noRollupOptions = ['packages', 'createLoaders', 'hashFileNames'];
        /**
         *
         * @private
         * @returns void
         */
        this.buildRollupConfig = () => {
            const packages = this.workspace.packages;
            const external = (id) => id.includes('core-js'); // todo merge with this.config
            packages.filter(pkg => pkg.isModified).map((pkg) => pkg.output.map(output => this.rollupConfigurations.push(Object.assign(Object.assign({}, this.cleanRollupOptions), {
                plugins: this.plugins.get(output.name),
                input: pkg.input,
                external,
                output,
            }))));
            if (!this.rollupConfigurations.length) {
                this.log.success('All package bundles are present and up-to-date. Nothing to do.');
            }
        };
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.workspace.init();
            this.buildRollupConfig();
            this.generateLoaders();
            return this.rollupConfigurations.length
                ? this.rollupConfigurations
                : process.exit(0);
        });
    }
    /**
     *
     * @private
     */
    get cleanRollupOptions() {
        const rollupOptions = Object.assign({}, this.buildOptions);
        this.noRollupOptions.map(key => Reflect.deleteProperty(rollupOptions, key));
        return rollupOptions;
    }
    /**
     *
     * @private
     * @returns void
     */
    generateLoaders() {
        this.workspace.options.createLoaders && this.workspace.modifiedPackages
            .map(({ distDir, output, hash }) => __awaiter(this, void 0, void 0, function* () { return new loader_1.default(output).output(distDir, hash); }));
    }
}
exports.MonoBundler = MonoBundler;
//# sourceMappingURL=mono-bundler.js.map