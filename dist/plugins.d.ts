import { Config } from './types/config';
import { Plugin } from 'rollup';
export default class Plugins {
    private readonly options;
    constructor(options: Config.BuildOptions);
    /**
     *
     * @param {string} target
     * @returns Plugin[]
     */
    get(target: string): Plugin[];
}
