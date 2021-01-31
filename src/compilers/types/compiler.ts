import {RollupOptions} from "rollup"
import { Listr, ListrContext, ListrTaskWrapper } from 'listr2'

export interface Compiler {
    tasks(ctx: ListrContext, task?: ListrTaskWrapper<any, any>): Listr
    id?: string
    taskName?: string
}

export type MonoRollupOptions = RollupOptions & RollupOptions[]


