import { hashElement } from 'folder-hash'
import fileSystem from './filesystem'

export default class Hash {
    private hash: string = ''

    /**
     *
     * @param {string} input
     */
    constructor(private readonly input: string) {
    }

    /**
     * @todo description
     * @returns {string}
     */
    async get(): Promise<string> {
        await this.generate()
        return this.hash
    }

    /**
     * @returns {Promise<string>}
     */
    async generate(): Promise<string> {
        if (this.hash) return this.hash

        const hash = (await hashElement(this.input)).hash
            .toString()
            .replace(/[^a-z0-9]/gi, '')
            .slice(0, 16)
            .toLowerCase()

        this.hash = hash

        return this.hash;
    }

    writeHashFile() {
        //outputFileSync(fileSystem.join(targetPath, '.hash'), hash)
    }

}
