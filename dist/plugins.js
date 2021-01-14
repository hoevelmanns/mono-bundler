import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import presets from './presets';
export default class Plugins {
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
            nodeResolve({ extensions: ['.js', '.ts'] }),
            babel({
                babelHelpers: 'bundled',
                extensions: ['.js', '.ts'],
                presets: presets[target.toString()],
                plugins: [
                    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
                    '@babel/plugin-proposal-class-properties',
                ],
            }),
        ];
        return ((_a = this.options.plugins) === null || _a === void 0 ? void 0 : _a.length) ? [...internalPlugins, ...this.options.plugins] : internalPlugins;
    }
}
