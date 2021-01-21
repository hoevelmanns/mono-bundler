"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Dependency {
    /**
     * @param {string[]} dep
     */
    constructor(dep) {
        Object.assign(this, { name: dep[0], version: dep[1] });
    }
}
exports.default = Dependency;
