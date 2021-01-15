"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const plugin_babel_1 = __importDefault(require("@rollup/plugin-babel"));
const presets_1 = __importDefault(require("./presets"));
class Plugins {
    constructor(options) {
        this.options = options;
    }
    /**
     *
     * @param {string} target
     * @returns Plugin[]
     */
    get(target) {
        var _a;
        const internalPlugins = [
            plugin_node_resolve_1.default({ extensions: ['.js', '.ts'] }),
            plugin_babel_1.default({
                babelHelpers: 'bundled',
                extensions: ['.js', '.ts'],
                // @ts-ignore todo
                presets: presets_1.default[target.toString()],
                plugins: [
                    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
                    '@babel/plugin-proposal-class-properties',
                ],
            }),
        ];
        return ((_a = this.options.plugins) === null || _a === void 0 ? void 0 : _a.length) ? [...internalPlugins, ...this.options.plugins] : internalPlugins;
    }
}
exports.default = Plugins;
//# sourceMappingURL=plugins.js.map