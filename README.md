# mono-bundler

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3255f4d75d9d44daac58f4c177191365)](https://app.codacy.com/gh/hoevelmanns/mono-bundler?utm_source=github.com&utm_medium=referral&utm_content=hoevelmanns/mono-bundler&utm_campaign=Badge_Grade)

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
