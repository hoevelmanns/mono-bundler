import { InputOptions, ModuleFormat, RollupOptions } from 'rollup';
import { ParsedArgs } from "minimist";
export declare type MonoRollupOptions = RollupOptions & RollupOptions[];
export declare type LoaderElemAttribute = {
    name: string;
    value: string;
};
export declare type Bundle = {
    type: 'default' | 'legacy';
    extraFileExtension: string;
    format: ModuleFormat & string;
    LoaderElemAttributes?: LoaderElemAttribute[];
    omitLoader?: boolean;
};
interface CustomRollupOptions extends Omit<InputOptions, 'input'> {
    packages: string | string[];
    bundles?: Bundle[];
    createLoaders?: boolean;
    hashFileNames?: boolean;
    silent?: boolean;
    legacyBrowserSupport?: boolean;
}
export declare type BuildOptions = CustomRollupOptions;
export declare type TransformedArgs = Partial<BuildOptions & ParsedArgs>;
export declare type AvailableBuildOptions = (keyof BuildOptions)[];
export declare const Bundles: Bundle[];
/**
 *
 * @param {string} name
 * @returns Bundle
 */
export declare const getBundle: (name: string) => Bundle;
export declare const rollupExternals: string[];
export {};
