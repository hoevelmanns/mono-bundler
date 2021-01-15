import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import { Plugin } from 'rollup'
import presets from './presets'
import { BuildOptions } from './types'

export default class Plugins {

    constructor(private readonly options: BuildOptions) {}

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
                // @ts-ignore todo
                presets: presets[target.toString()],
                plugins: [
                    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
                    '@babel/plugin-proposal-class-properties',
                ],
            }),
        ]

        return this.options.plugins?.length ? [...internalPlugins, ...this.options.plugins] : internalPlugins
    }
}
