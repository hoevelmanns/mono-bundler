import RollupConfig from './dist/rollup-config'
import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'

export default async () => await new RollupConfig({
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
}).create()
