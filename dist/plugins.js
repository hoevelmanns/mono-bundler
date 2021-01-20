"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const plugin_babel_1 = __importDefault(require("@rollup/plugin-babel"));
const presets_1 = require("./presets");
const tsyringe_1 = require("tsyringe");
const plugin_typescript_1 = __importDefault(require("@rollup/plugin-typescript"));
let Plugins = class Plugins {
    constructor(buildOptions) {
        this.buildOptions = buildOptions;
    }
    /**
     *
     * @param {OutputOptions} output
     * @param {Package} pkg
     * @returns Plugin[]
     */
    get(output, pkg) {
        var _a;
        const internalPlugins = [
            plugin_node_resolve_1.default({ rootDir: pkg.packageDir, extensions: ['.ts', '.js'] }),
            pkg.tsConfigPath && plugin_typescript_1.default({ tsconfig: pkg.tsConfigPath }),
            plugin_babel_1.default({
                root: pkg.packageDir,
                exclude: /node_modules/,
                babelHelpers: 'bundled',
                extensions: ['.js', '.ts'],
                presets: presets_1.presets[output.name],
                plugins: [
                    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
                    '@babel/plugin-proposal-class-properties',
                ],
            }),
        ];
        return ((_a = this.buildOptions.plugins) === null || _a === void 0 ? void 0 : _a.length) ? [...internalPlugins, ...this.buildOptions.plugins] : internalPlugins;
    }
};
Plugins = __decorate([
    __param(0, tsyringe_1.inject('BuildOptions'))
], Plugins);
exports.default = Plugins;
/*
exclude: 'node_modules/**',
            babelHelpers: 'bundled',
            extensions: ['.ts', '.js'],
            presets: [
                '@babel/preset-typescript',
            ],
            plugins: [
                ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
                '@babel/plugin-proposal-class-properties',
            ],
        }),
 */ 
//# sourceMappingURL=plugins.js.map