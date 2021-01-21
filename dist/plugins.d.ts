import { OutputOptions, Plugin } from 'rollup';
import { BuildOptions } from './types';
import Package from "./package";
export default class Plugins {
    protected readonly buildOptions: BuildOptions;
    constructor(buildOptions: BuildOptions);
    /**
     *
     * @param {OutputOptions} output
     * @param {Package} pkg
     * @returns Plugin[]
     */
    get(output: OutputOptions, pkg: Package): Plugin[];
}
