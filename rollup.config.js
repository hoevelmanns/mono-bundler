import MonoRollup from './dist/rollup-config'
import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'

export default async () => await new MonoRollup({
    dirname: [
        '../custom/plugins/*/Resources/frontend',
        '../themes',
    ],
    legacySupport: true,
    createLoaders: true,
    plugins: [
        filesize(),
        terser(),
    ],
}).build()
