# mono-bundler

Work in process

#Usage

In rollup.config.js:

```js
import MonoBundler from './dist/mono-bundler'
import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'

export default async () => await new MonoBundler({
    packages: [
        '../frontend',
        '../themes',
    ],
    legacySupport: true,
    createLoaders: true,
    plugins: [
      // rollup plugins
    ],

}).build()

```
