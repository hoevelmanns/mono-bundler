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
const logger_1 = __importDefault(require("./libs/logger"));
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
            this.log = new logger_1.default((_a = this.options) === null || _a === void 0 ? void 0 : _a.silent);
            this.setGlobs();
            yield this.findPackages();
            yield this.findDependencies();
            this.log.info(`Found ${this.packages.length} packages`);
            this.log.info(`Found ${this.dependencies.length} dependencies`);
            this.showModifiedPackages();
            return this;
        });
    }
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
     */
    get options() {
        return Object.assign(Object.assign({}, this.buildOptions), this.args);
    }
    setGlobs() {
        const { packages } = this.buildOptions;
        this.globs = Array.isArray(packages) ? packages : [packages];
    }
    /**
     * Gets the list of package json files of defined projects
     *
     * @returns void
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
    showModifiedPackages() {
        const { modifiedPackages } = this;
        modifiedPackages.length && this.log.info('Modified packages:');
        modifiedPackages.map(pkg => this.log.yellow(`- ${pkg.name}`));
    }
}
exports.default = Workspace;
//# sourceMappingURL=workspace.js.map