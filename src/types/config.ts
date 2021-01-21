import { InputOptions, ModuleFormat, RollupOptions } from 'rollup'
import {ParsedArgs} from "minimist";

export type MonoRollupOptions = RollupOptions[]

export type LoaderElemAttribute = {
    name: string,
    value: string
}

export type Target = {
    type: 'default' | 'legacy',
    extraFileExtension: string,
    format: ModuleFormat & string,
    LoaderElemAttributes?: LoaderElemAttribute[]
    omitLoader?: boolean,
}

interface CustomRollupOptions extends Omit<InputOptions, 'input'> {
    packages: string | string[]
    targets?: Target[],
    createLoaders?: boolean,
    hashFileNames?: boolean,
    silent?: boolean,
    legacyBrowserSupport?: boolean,
}

export type BuildOptions = CustomRollupOptions

export type TransformedArgs = Partial<BuildOptions & ParsedArgs>

export type AvailableBuildOptions = Partial<(keyof BuildOptions)[]>

export const Targets: Target[] = [
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
 * @returns Target
 */
export const target = (name: string) => {
    return Targets.find(t => t.type === name)
}

export interface Bundle {
    file: string
    target: Target
}

export const rollupExternals = ['core-js']
