import { InputOptions, ModuleFormat } from 'rollup'

export namespace Config {

    interface CustomRollupOptions extends Omit<InputOptions, 'input'> {
        packages: string | string[]
        createLoaders?: boolean,
        hashFileNames?: boolean,
        silent?: boolean
    }

    export type BuildOptions = CustomRollupOptions

    export type AvailableBuildOptions = Partial<(keyof BuildOptions)[]>

    export const Target = {
        default: { name: 'default', extraFileExtension: '', format: <ModuleFormat>'esm', loaderAttribute: 'elem.type="module"' },
        legacy: { name: 'legacy', extraFileExtension: 'legacy', format: <ModuleFormat>'iife', loaderAttribute: 'elem.noModule=true'  },
    }

    export interface Bundle {
        file: string
        target: typeof Target
    }

    export const rollupExternals = ['core-js']
}
