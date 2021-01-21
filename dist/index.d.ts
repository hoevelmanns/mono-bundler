import "reflect-metadata";
import { BuildOptions } from './types';
/**
 *
 * @param {BuildOptions} options
 */
export declare const monobundler: (options: BuildOptions) => Promise<import("./types").MonoRollupOptions>;
