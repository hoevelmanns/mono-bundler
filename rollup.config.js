import MonoBundler from './dist/mono-bundler'
import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'

export default async () => await new MonoBundler({
    packages: [
        '../custom/plugins/*/Resources/frontend',
        '../themes',
    ],
    legacySupport: true,
    createLoaders: true,
    plugins: [
        filesize(),
        terser({
            output: {
                comments: false,
            },
            mangle: { reserved: ['$'] }
        }),
    ],

}).build()
