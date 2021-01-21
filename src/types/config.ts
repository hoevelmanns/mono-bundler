import { InputOptions, ModuleFormat, RollupOptions } from 'rollup'
import {ParsedArgs} from "minimist"
import {Scripts} from "./package"

export type MonoRollupOptions = RollupOptions[]
export type LoaderElemAttribute = {
    name: string,
    value: string
}

export type Bundle = {
    type: 'default' | 'legacy',
    extraFileExtension: string,
    format: ModuleFormat & string,
    LoaderElemAttributes?: LoaderElemAttribute[]
    omitLoader?: boolean,
}

interface CustomRollupOptions extends Omit<InputOptions, 'input'> {
    packages: string | string[]
    bundles?: Bundle[],
    createLoaders?: boolean,
    hashFileNames?: boolean,
    silent?: boolean,
    legacyBrowserSupport?: boolean,
}

export type BuildOptions = CustomRollupOptions

export type TransformedArgs = Partial<BuildOptions & ParsedArgs>

export type AvailableBuildOptions = (keyof BuildOptions)[]

export type ScriptKeys = keyof Scripts

export const Bundles: Bundle[] = [
    {
        type: 'default',
        extraFileExtension: '',
        format: 'esm',
        LoaderElemAttributes: [{ name: 'type', value: 'module' }],
    },
    {
        type: 'legacy',
        extraFileExtension: 'legacy',
        format: 'iife',
        LoaderElemAttributes: [{ name: 'noModule', value: 'true' }],
    },
]

/**
 *
 * @param {string} name
 * @returns Bundle
 */
export const getBundle = (name: string): Bundle => {
    return Bundles.find(t => t.type === name)
}

export const rollupExternals = ['core-js']
