import * as path from 'path'
import fs from 'fs-extra'

class FileSystem {
    static concat(filename: string, str: string) {
        const outputExtension = path.extname(filename)
        return filename.replace(outputExtension, `.${str}${outputExtension}`)
    }

    static dirname = file => path.dirname(file)

    static existsSync = file => fs.existsSync(file)
}

const fileSystem = FileSystem

export default fileSystem
