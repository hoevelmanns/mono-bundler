import { InputOptions, ModuleFormat } from 'rollup'

interface CustomRollupOptions extends Omit<InputOptions, 'input'> {
    packages: string | string[]
    targets?: Targets,
    createLoaders?: boolean,
    hashFileNames?: boolean,
    silent?: boolean
}

export type LoaderElemAttribute = {
    name: string,
    value: string
}

export type Target = {
    type: 'default' | 'legacy',
    extraFileExtension: string,
    format: ModuleFormat & string,
    LoaderElemAttributes?: LoaderElemAttribute[]
    omitLoader?: boolean
}

export type Targets = Target[]

export type BuildOptions = CustomRollupOptions

export type AvailableBuildOptions = Partial<(keyof BuildOptions)[]>

/**
 *
 * @param {string} name
 * @returns Target
 */
export const target = (name: string) => {
    return Targets.find(t => t.type === name)
}

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

export interface Bundle {
    file: string
    target: Target
}

export const rollupExternals = ['core-js']
