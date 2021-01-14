export default class Dependency {
    /**
     * @param {string[]} dep
     */
    constructor(dep) {
        Object.assign(this, { name: dep[0], version: dep[1] });
    }
}
