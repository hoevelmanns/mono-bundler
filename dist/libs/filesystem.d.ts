declare class FileSystem {
    static concat(filename: string, str: string): string;
    static dirname: (file: string) => string;
    static copySync: (src: string, dest: string, opts?: any) => void;
    static existsSync: (file: string) => boolean;
    static join: (...paths: string[]) => string;
    static outputFileSync: (dest: string, content: string) => void;
    static resolve: (...pathSegments: string[]) => string;
    static filename: (path: string) => string;
    static extname: (p: string) => string;
}
export declare const fileSystem: typeof FileSystem;
export {};
