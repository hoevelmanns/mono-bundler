import { RollupOptions } from 'rollup'

export namespace Config {

    interface CustomRollupOptions {
        packages: string | string[]
        /**
         * @description if true, then older browsers will be supported, also the ie 11
         */
        legacySupport?: boolean,
        createLoaders?: boolean
        silent?: boolean
        watch?: boolean
    }

    export type BuildOptions = CustomRollupOptions & Omit<RollupOptions, 'output' | 'input'>;

    export type AvailableBuildOptions = Partial<(keyof BuildOptions)[]>

    export enum Target {
        default = 'default',
        legacy = 'legacy'
    }

    export enum BundleFormat {
        iife = 'iife',
        esm = 'esm'
    }

    export interface Bundle {
        file: string
        target: string
    }
}
