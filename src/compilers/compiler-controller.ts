import { Compiler } from './types'
import { Listr, ListrTask } from 'listr2'
import { Constructor } from 'shared'

export class CompilerController {
	compilers: Compiler[] = []
	tasks = new Listr([])
	
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
			task: (ctx, task): Listr => task.newListr(compiler.tasks(ctx)),
		}))
		
		try {
			await this.tasks.run()
		} catch (e) {
			console.error(e)
		}
	}
	
	/**
	 * @param {ListrTask} task
	 * @private
	 */
	private addTask(task: ListrTask) {
		this.tasks.add(task)
	}
}

export const compilers = (...compilers: Constructor<Compiler>[]) => new CompilerController(...compilers)