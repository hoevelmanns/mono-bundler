import {RollupOptions} from "rollup"

export interface ICompiler {
    build(): Promise<void>
    id?: string
}

export type MonoRollupOptions = RollupOptions & RollupOptions[]