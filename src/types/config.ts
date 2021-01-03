import { Plugin } from 'rollup'

export namespace Config {
    export interface BuildOptions {
        dirname: string | string[]
        legacySupport?: boolean,
        plugins?: Plugin[]
        createLoaders?: boolean
        silent?: boolean
        watch?: boolean
    }

    export enum Target {
        default = 'default',
        legacy = 'legacy'
    }

    export enum BundleFormat {
        iife ='iife',
        esm = 'esm'
    }

    export interface Bundle {
        file: string
        target: string
    }
}
