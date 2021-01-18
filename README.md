# mono-bundler
Monorepo bundler based on [rollup.js](https://github.com/rollup/rollup)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3255f4d75d9d44daac58f4c177191365)](https://app.codacy.com/gh/hoevelmanns/mono-bundler?utm_source=github.com&utm_medium=referral&utm_content=hoevelmanns/mono-bundler&utm_campaign=Badge_Grade)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

#Usage

In rollup.config.js:

```js
import MonoBundler from 'mono-bundler'

export default async () => await new MonoBundler({
    packages: [
        'components',
        'microapp2',
        'packages/*/microapps',
    ],
    createLoaders: true, // creates a loader file
    hashFileNames: true, // adds a hash to the output file names
    legacyBrowserSupport: true, // adds babel runtime polyfills for legacy browsers, e.g. IE11

    // rollup options
    plugins: [
    	// rollup plugins
    ],
}).build()
```

For further options, see: [Rollup Options](https://rollupjs.org/guide/en/#big-list-of-options)
