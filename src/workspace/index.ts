import {options, Options} from "./options"
import {Workspace, workspace} from "./workspace"
import {logger, MonoOptions} from "shared"
import { Packages, packages } from './packages'
import { Package } from "./package"

export const initWorkspace = async (config: Partial<MonoOptions>) =>
    options(config) &&
    logger() &&
    await packages() &&
    await workspace()

export * from './types'
export {
    Workspace,
    Packages,
    Package,
    Options,
}
