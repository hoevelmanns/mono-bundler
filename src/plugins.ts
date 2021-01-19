import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import { Plugin } from 'rollup'
import presets from './presets'
import { BuildOptions } from './types'
import { inject } from 'tsyringe'

export default class Plugins {

    constructor(@inject('BuildOptions') protected readonly buildOptions: BuildOptions) {}

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
                presets: presets[<string>target],
                plugins: [
                    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
                    '@babel/plugin-proposal-class-properties',
                ],
            }),
        ]

        return this.buildOptions.plugins?.length ? [...internalPlugins, ...this.buildOptions.plugins] : internalPlugins
    }
}
