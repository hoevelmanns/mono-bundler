"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dependency_1 = __importDefault(require("./dependency"));
const package_1 = __importDefault(require("./package"));
const libs_1 = require("./libs");
const fb = __importStar(require("fast-glob"));
class Workspace {
    constructor(buildOptions) {
        this.buildOptions = buildOptions;
        this.packages = [];
        this.dependencies = [];
        this.globs = [];
        this.args = require('minimist')(process.argv.slice(2));
    }
    init() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.log = new libs_1.Logger((_a = this.options) === null || _a === void 0 ? void 0 : _a.silent);
            this.setGlobs();
            yield this.findPackages();
            yield this.findDependencies();
            this.showReport();
            return this;
        });
    }
    /**
     * @returns Package[]
     */
    get modifiedPackages() {
        return this.packages.filter(pkg => pkg.isModified);
    }
    /**
     * @returns boolean
     */
    get hasModifiedPackages() {
        return this.modifiedPackages.length > 0;
    }
    /**
     * @private
     * @returns Config.BuildOptions
     */
    get options() {
        return Object.assign(Object.assign({}, this.buildOptions), this.args);
    }
    /**
     *
     * @private
     * @returns void
     */
    setGlobs() {
        const { packages } = this.buildOptions;
        this.globs = Array.isArray(packages) ? packages : [packages];
    }
    /**
     * Gets the list of package json files of defined projects
     *
     * @returns Promise<void>
     */
    findPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.globs.map((glob) => __awaiter(this, void 0, void 0, function* () {
                const packageLocations = fb.sync(`${glob}/package.json`);
                yield Promise.all(packageLocations.map((pkgJson) => __awaiter(this, void 0, void 0, function* () { return yield this.packages.push(yield new package_1.default(pkgJson, this.options).init()); })));
            })));
        });
    }
    /**
     * Gets all dependencies of defined projects
     *
     * @returns void
     */
    findDependencies() {
        this.packages.map(pkg => this.dependencies = pkg.hasOwnProperty('dependencies')
            ? [...this.dependencies, ...Object.entries(pkg.dependencies)]
            : this.dependencies);
        this.dependencies = Array
            .from(new Set(this.dependencies).values())
            .map(dep => new dependency_1.default(dep));
    }
    /**
     *
     * @private
     * @returns void
     */
    showReport() {
        const { modifiedPackages, packages, dependencies } = this;
        this.log.info(`Found packages: ${packages.length}`);
        this.log.info(`Found dependencies: ${dependencies.length}`);
        modifiedPackages.length && this.log.info('Modified packages:');
        modifiedPackages.map(pkg => this.log.yellow(`- ${pkg.name}`));
    }
}
exports.default = Workspace;
//# sourceMappingURL=workspace.js.map