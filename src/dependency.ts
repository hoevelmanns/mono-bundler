export default class Dependency {

    /**
     * @param {string[]} dep
     */
    constructor(dep: {}) { // todo
        Object.assign(this, { name: dep[0], version: dep[1] })
    }
}
