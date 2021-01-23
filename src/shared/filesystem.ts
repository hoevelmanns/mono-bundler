import path from 'path'
import fs from 'fs-extra'
import { outputFileSync } from 'fs-extra'

class FileSystem {
    static concat(filename: string, str: string) {
        if (str.length === 0) {
            return filename
        }

        const outputExtension = path.extname(filename)
        return filename.replace(outputExtension, `.${str}${outputExtension}`)
    }

    static dirname = (file: string) => path.dirname(file)

    static copySync = (src: string, dest: string, opts?: any) => fs.copySync (src, dest, opts)

    static existsSync = (file: string) => fs.existsSync(file)

    static join = (...paths: string[]) => path.join(...paths)

    static outputFileSync = (dest: string, content: string) => outputFileSync(dest, content)

    static resolve = (...pathSegments: string[]) => path.resolve(...pathSegments)

    static filename = (path: string) => path.split("/").pop()

    static extname = (p: string): string => path.extname(p)
}

export const fileSystem = FileSystem

