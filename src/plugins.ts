import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import { Config } from './types/config'
import presets from './presets'
import { Plugin } from 'rollup'

export default class Plugins {

    constructor(private readonly options: Config.BuildOptions) {}

    /**
     *
     * @param {string} target
     * @returns Plugin[]
     */
    get(target: string): Plugin[] {
        const internalPlugins = [
            nodeResolve({ extensions: ['.js', '.ts'] }),
            babel({
                babelHelpers: 'bundled',
                extensions: ['.js', '.ts'],
                presets: presets[target],
                plugins: [
                    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
                    '@babel/plugin-proposal-class-properties',
                ],
            }),
        ]

        return this.options.plugins?.length ? [...internalPlugins, ...this.options.plugins] : internalPlugins
    }
}
