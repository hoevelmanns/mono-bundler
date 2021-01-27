import 'reflect-metadata'
import {rollupCompiler} from 'compilers'
import {initWorkspace} from 'workspace'
import boxen from 'boxen'
import chalk from 'chalk'
import path from "path"
import {MonoOptions} from "shared"

console.log(boxen(`${chalk.magenta('Mono Bundler')}`, {
    padding: 1,
    borderColor: 'magenta',
    margin: {bottom: 1, top: 1, left: 0, right: 0},
}))

const defaultConfig: MonoOptions = {
    createLoaders: false,
    legacyBrowserSupport: false,
    hashFileNames: false,
    packages: []
}

require('esm-config')(path.join(process.cwd(), 'mono.config.js'), defaultConfig)
    .then(async (config: MonoOptions) =>
        await initWorkspace(config) &&
        await rollupCompiler().execute())

export {
    MonoOptions
}