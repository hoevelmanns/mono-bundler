import 'reflect-metadata'
import { cosmiconfig } from 'cosmiconfig'
import { rollupCompiler } from 'compilers'
import { initWorkspace } from 'workspace'
import boxen from 'boxen'
import chalk from 'chalk'

// todo load es config, see https://rollupjs.org/guide/en/#programmatically-loading-a-config-file

console.log(boxen(
	`${chalk.magenta('Mono Bundler')}`, {
		padding: 1,
		borderColor: 'magenta',
		margin: { bottom: 1, top: 1, left: 0, right: 0 },
	}))

cosmiconfig('mono')
	.search()
	.then(async ({ config }) =>
		await initWorkspace(config) &&
		await rollupCompiler().execute())
	.catch(error => console.error(error))
