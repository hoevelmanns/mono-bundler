import { options, Options } from './options'
import { logger, MonoOptions } from 'shared'
import { Packages, packages } from './packages'
import { Package } from './package'

export const initWorkspace = async (config: Partial<MonoOptions>) =>
	options(config) &&
	logger() &&
	await packages()

export * from './types'
export {
	Packages,
	Package,
	Options,
}
