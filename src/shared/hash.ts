import { hashElement } from 'folder-hash'

export class Hash {
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
        if (this.hash) {
            return this.hash
        }

        // todo adds package.json and check this.input -> must be a path
        this.hash = (await hashElement(this.input)).hash
            .toString()
            .replace(/[^a-z0-9]/gi, '')
            .slice(0, 16)
            .toLowerCase()

        return this.hash
    }
}
