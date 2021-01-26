# mono-bundler

Monorepo bundler based on [rollup.js](https://github.com/rollup/rollup) and [vercel/ncc](https://github.com/vercel/ncc)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3255f4d75d9d44daac58f4c177191365)](https://app.codacy.com/gh/hoevelmanns/mono-bundler?utm_source=github.com&utm_medium=referral&utm_content=hoevelmanns/mono-bundler&utm_campaign=Badge_Grade)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

## Usage

### Installation
```console
npm i mono-bundler
```

### Usage in workspace
package.json (root)
```json
"scripts": {
    "build": "mono -c",
}
```

Create mono.config.js:

```js
module.exports = {
  packages: [
    'apps/**/*',
    'packages/*/components',
  ],
  createLoaders: true,
  hashFileNames: true,
  legacyBrowserSupport: true,
  // rollup options
  plugins: [
    // rollup plugins
  ] 
}
```

For further options, see: [Rollup Options](https://rollupjs.org/guide/en/#big-list-of-options)
