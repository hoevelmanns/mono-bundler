export default class Hash {
    private readonly input;
    private hash;
    /**
     *
     * @param {string} input
     */
    constructor(input: string);
    /**
     * @todo description
     * @returns {string}
     */
    get(): Promise<string>;
    /**
     * @returns {Promise<string>}
     */
    generate(): Promise<string>;
}
