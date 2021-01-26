import {RollupOptions} from "rollup"

export interface ICompiler {
    execute(): Promise<void>
    id?: string
}

export type MonoRollupOptions = RollupOptions & RollupOptions[]