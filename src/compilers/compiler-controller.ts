import {Compiler} from './types'
import {Listr, ListrTask} from 'listr2'
import {Constructor} from 'shared'

export class CompilerController {
    compilers: Compiler[] = []
    tasks = new Listr([], {
        rendererOptions: {
            showErrorMessage: true,
            showTimer: true,
            collapse: false,
            lazy: false
        },
        concurrent: true
    })

    /**
     * @param {Compiler[]} compilers
     * @returns CompilerController
     */
    constructor(...compilers: Constructor<Compiler>[]) {
        compilers.forEach(Compiler => this.compilers.push(new Compiler()))
    }

    /**
     * @returns void
     */
    async run(): Promise<void> {
        this.compilers.map(compiler => this.addTask({
            title: compiler.taskName,
            enabled: () => compiler.tasks.length > 0,
            task: async (ctx, task): Promise<Listr> => await compiler.tasks(ctx, task),
        }))

        await this.tasks.run()
    }

    /**
     * @param {ListrTask} task
     * @private
     */
    addTask(task: ListrTask) {
        this.tasks.add(task)
    }
}

export const compilers = (...compilers: Constructor<Compiler>[]) => new CompilerController(...compilers)