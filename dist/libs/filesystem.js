import * as path from 'path';
import fs from 'fs-extra';
import { outputFileSync } from 'fs-extra';
class FileSystem {
    static concat(filename, str) {
        if (str.length === 0) {
            return filename;
        }
        const outputExtension = path.extname(filename);
        return filename.replace(outputExtension, `.${str}${outputExtension}`);
    }
}
FileSystem.dirname = file => path.dirname(file);
FileSystem.copySync = (src, dest, opts) => fs.copySync(src, dest, opts);
FileSystem.existsSync = file => fs.existsSync(file);
FileSystem.join = (...paths) => path.join(...paths);
FileSystem.outputFileSync = (dest, content) => outputFileSync(dest, content);
FileSystem.resolve = (...pathSegments) => path.resolve(...pathSegments);
const fileSystem = FileSystem;
export default fileSystem;
