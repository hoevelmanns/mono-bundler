import {InputOptions, ModuleFormat} from 'rollup'
import {ParsedArgs} from "minimist"
import { Compiler } from 'compilers'

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

export interface IMonoOptions {
    packages: string[],
    exclude?: string[],
    bundles?: Bundle[],
    createLoaders?: boolean,
    hashFileNames?: boolean,
    silent?: boolean,
    legacyBrowserSupport?: boolean,
    compilers?: Compiler[] // todo makes possible to add custom compilers
}

export type MonoOptions = IMonoOptions & Omit<InputOptions, 'input'>

export type TransformedArgs = Partial<MonoOptions & ParsedArgs>

export const Bundles: Bundle[] = [
    {
        type: 'default',
        extraFileExtension: '',
        format: 'esm',
        LoaderElemAttributes: [{name: 'type', value: 'module'}],
    },
    {
        type: 'legacy',
        extraFileExtension: 'legacy',
        format: 'iife',
        LoaderElemAttributes: [{name: 'noModule', value: 'true'}],
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
