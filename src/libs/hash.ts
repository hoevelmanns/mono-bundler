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
     *
     * @param {string} filename
     * @returns {string}
     */
    async file(filename: string) {
        await this.generate()
        return fileSystem.concat(filename, this.hash)
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
     * @returns {Promise<Hash>}
     */
    private async generate(): Promise<Hash> {
        if (this.hash) return this

        const sourceDir = fileSystem.dirname(this.input)

        this.hash = (await hashElement(sourceDir)).hash
            .toString()
            .replace(/[^a-z0-9]/gi, '')
            .slice(0, 16)
            .toLowerCase()

        return this
    }
}
