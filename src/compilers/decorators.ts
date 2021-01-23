export function Compiler(id: string) {
    return function (constructor: Function) {
        constructor.prototype.id = id
    }
}
