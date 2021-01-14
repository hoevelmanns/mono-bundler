import { InputOptions, ModuleFormat } from 'rollup';
export declare namespace Config {
    interface CustomRollupOptions extends Omit<InputOptions, 'input'> {
        packages: string | string[];
        createLoaders?: boolean;
        hashFileNames?: boolean;
        silent?: boolean;
    }
    export type BuildOptions = CustomRollupOptions;
    export type AvailableBuildOptions = Partial<(keyof BuildOptions)[]>;
    export const Target: {
        default: {
            name: string;
            extraFileExtension: string;
            format: ModuleFormat;
            loaderAttribute: string;
        };
        legacy: {
            name: string;
            extraFileExtension: string;
            format: ModuleFormat;
            loaderAttribute: string;
        };
    };
    export interface Bundle {
        file: string;
        target: typeof Target;
    }
    export const rollupExternals: string[];
    export {};
}
