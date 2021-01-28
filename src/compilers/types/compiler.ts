import {RollupOptions} from "rollup"
import { ListrContext, ListrTask } from 'listr2'

export interface Compiler {
    tasks(ctx: ListrContext): ListrTask[]
    id?: string
    taskName?: string
}

export type MonoRollupOptions = RollupOptions & RollupOptions[]


