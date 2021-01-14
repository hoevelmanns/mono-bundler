declare class FileSystem {
    static concat(filename: string, str: string): string;
    static dirname: (file: any) => string;
    static copySync: (src: any, dest: any, opts?: any) => any;
    static existsSync: (file: any) => any;
    static join: (...paths: string[]) => string;
    static outputFileSync: (dest: string, content: string) => any;
    static resolve: (...pathSegments: string[]) => string;
}
declare const fileSystem: typeof FileSystem;
export default fileSystem;
