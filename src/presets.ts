const defaultPresets = [
    '@babel/preset-typescript',
]

const legacyPresets = [
    '@babel/preset-typescript',
    [
        '@babel/preset-env',
        {
            corejs: 3,
            targets: 'defaults, ie >= 11', // todo only 'ie >= 11'?
            modules: false,
            useBuiltIns: 'usage',
            debug: false,
        },
    ],
]

export default {
    default: defaultPresets,
    legacy: legacyPresets
}
