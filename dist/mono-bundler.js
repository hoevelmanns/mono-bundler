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
const libs_1 = require("./libs");
const plugins_1 = __importDefault(require("./plugins"));
const loader_1 = __importDefault(require("./loader"));
const tsyringe_1 = require("tsyringe");
const minimist_1 = __importDefault(require("minimist"));
class MonoBundler {
    /**
     *
     * @param {BuildOptions} options
     */
    constructor(options) {
        var _a;
        this.options = options;
        this.rollupConfigurations = [];
        this.args = MonoBundler.transformedArgs;
        this.plugins = new plugins_1.default(this.buildOptions);
        this.noRollupOptions = ['packages', 'createLoaders', 'hashFileNames', 'legacyBrowserSupport'];
        /**
         *
         * @private
         * @returns void
         */
        this.buildRollupConfig = () => {
            const packages = this.buildOptions.watch
                ? this.workspace.packages
                : this.workspace.packages.filter(pkg => pkg.isModified);
            const external = (id) => id.includes('core-js'); // todo merge with this.config
            if (!(this.workspace.hasModifiedPackages || this.buildOptions.watch)) {
                this.log.success('All package bundles are present and up-to-date. Nothing to do.');
            }
            packages.map(pkg => pkg.output.map(output => this.rollupConfigurations.push(Object.assign(Object.assign({}, this.cleanRollupOptions), {
                plugins: this.plugins.get(output, pkg),
                input: pkg.input,
                external,
                output,
            }))));
        };
        tsyringe_1.container.register('BuildOptions', { useValue: this.buildOptions });
        tsyringe_1.container.register('Logger', { useValue: this.log = new libs_1.Logger((_a = this.buildOptions) === null || _a === void 0 ? void 0 : _a.silent) });
    }
    /**
     * @private
     * @returns BuildOptions
     */
    get buildOptions() {
        return Object.assign(Object.assign({}, this.options), this.args);
    }
    /**
     * @private
     */
    static get transformedArgs() {
        var _a;
        const args = minimist_1.default(process.argv.slice(2));
        args.watch = (_a = args.w) !== null && _a !== void 0 ? _a : args.watch;
        return args;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            this.createLoaders();
            this.buildRollupConfig();
            return this.rollupConfigurations.length
                ? this.rollupConfigurations
                : process.exit(0);
        });
    }
    /**
     * @returns void
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.workspace = yield new workspace_1.default().init();
        });
    }
    /**
     *
     * @private
     */
    get cleanRollupOptions() {
        const rollupOptions = Object.assign({}, this.buildOptions);
        this.noRollupOptions.map(key => Reflect.deleteProperty(rollupOptions, key));
        Object.keys(this.args).map(key => Reflect.deleteProperty(rollupOptions, key));
        return rollupOptions;
    }
    /**
     *
     * @private
     * @returns void
     */
    createLoaders() {
        const { buildOptions } = this;
        const hashFileNames = buildOptions.hashFileNames;
        buildOptions.createLoaders && !buildOptions.watch && this.workspace.modifiedPackages
            .map(({ distDir, output, hash, bundleFilename }) => __awaiter(this, void 0, void 0, function* () { return new loader_1.default(output, bundleFilename, hashFileNames && hash).output(distDir); }));
    }
}
exports.MonoBundler = MonoBundler;
//# sourceMappingURL=mono-bundler.js.map