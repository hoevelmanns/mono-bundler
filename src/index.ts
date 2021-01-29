import 'reflect-metadata'
import {compilers, Rollup} from 'compilers'
import {version} from '../package.json'
import {initWorkspace} from 'workspace'
import {MonoOptions} from 'shared'
import boxen from 'boxen'
import chalk from 'chalk'
import path from 'path'

console.log(boxen(`${chalk.white.bold(`📦 Mono Bundler ${version}`,)}`, {
    padding: 1,
    borderColor: 'white',
    margin: {bottom: 1, top: 1, left: 0, right: 0},
}))

const defaultConfig: MonoOptions = {
    createLoaders: false,
    legacyBrowserSupport: false,
    hashFileNames: false,
    packages: [],
}

require('esm-config')(path.join(process.cwd(), 'mono.config.js'), defaultConfig)
    .then(async (config: MonoOptions) => await initWorkspace(config) && await compilers(Rollup).run())

export {
    MonoOptions,
}