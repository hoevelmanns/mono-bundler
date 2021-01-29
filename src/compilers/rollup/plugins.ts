import babel from '@rollup/plugin-babel'
import {OutputOptions, Plugin} from 'rollup'
import {presets} from './presets'
import {Package} from "workspace"
import {container} from "tsyringe"
import nodeResolve from "@rollup/plugin-node-resolve"
import {Options} from "workspace"
import typescript from "rollup-plugin-typescript2"

const tsconfigDefaults = {
    // todo -> >>"module": "es2015"<< for rollup
}

export default class RollupPlugins {

    protected readonly options = <Options>container.resolve('Options')

    /**
     *
     * @param {OutputOptions} output
     * @param {Package} pkg
     * @returns Plugin[]
     */
    get(output: OutputOptions, pkg: Package): Plugin[] {
        const internalPlugins = [
            nodeResolve({rootDir: pkg.packageDir, extensions: ['.ts', '.js']}),
            pkg.tsConfigPath && typescript({
                tsconfig: pkg.tsConfigPath,
                abortOnError: true,
                tsconfigDefaults,
            }), // todo abortOnError necessary?
            babel({
                root: pkg.packageDir,
                exclude: /node_modules/,
                babelHelpers: 'bundled',
                extensions: ['.js', '.ts'],
                presets: presets[output.name],
                plugins: [
                    ['@babel/plugin-proposal-decorators', {decoratorsBeforeExport: true}],
                    '@babel/plugin-proposal-class-properties',
                ],
            }),
        ]

        return this.options.plugins?.length ? [...internalPlugins, ...this.options.plugins] : internalPlugins
    }
}