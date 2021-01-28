export function Bundler(id: string, taskName: string) {
    return function (constructor: Function) {
        constructor.prototype.id = id
        constructor.prototype.taskName = taskName
    }
}
