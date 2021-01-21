import "reflect-metadata"
import { MonoBundler } from "./mono-bundler"
import { BuildOptions } from './types'

/**
 *
 * @param {BuildOptions} options
 */
export const monobundler = (options: BuildOptions) => new MonoBundler(options).build()
