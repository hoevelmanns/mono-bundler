import { ModuleFormat, RollupOptions } from 'rollup'

export namespace Config {

    interface CustomRollupOptions {
        packages: string | string[]
        createLoaders?: boolean,
        hashFileNames?: boolean,
        silent?: boolean
        watch?: boolean
    }

    export type BuildOptions = CustomRollupOptions & Omit<RollupOptions, 'output' | 'input'>;

    export type AvailableBuildOptions = Partial<(keyof BuildOptions)[]>

    export const Target = {
        default: { name: 'default', extraFileExtension: '', format: <ModuleFormat>'esm', loaderAttribute: 'elem.type="module"' },
        legacy: { name: 'legacy', extraFileExtension: 'legacy', format: <ModuleFormat>'iife', loaderAttribute: 'elem.noModule=true'  },
    }

    export interface Bundle {
        file: string
        target: typeof Target
    }
}
