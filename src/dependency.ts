export default class Dependency {

    name: string
    version: string
    /**
     * @param {string[]} dep
     */
    constructor(dep: string[]) {
        Object.assign(this, { name: dep[0], version: dep[1] })
    }
}
