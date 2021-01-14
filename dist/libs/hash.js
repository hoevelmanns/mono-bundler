import { hashElement } from 'folder-hash';
export default class Hash {
    /**
     *
     * @param {string} input
     */
    constructor(input) {
        this.input = input;
        this.hash = '';
    }
    /**
     * @todo description
     * @returns {string}
     */
    async get() {
        await this.generate();
        return this.hash;
    }
    /**
     * @returns {Promise<string>}
     */
    async generate() {
        if (this.hash)
            return this.hash;
        this.hash = (await hashElement(this.input)).hash
            .toString()
            .replace(/[^a-z0-9]/gi, '')
            .slice(0, 16)
            .toLowerCase();
        return this.hash;
    }
}
