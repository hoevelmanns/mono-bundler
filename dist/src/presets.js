"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultPresets = [
    '@babel/preset-typescript',
];
const legacyPresets = [
    '@babel/preset-typescript',
    [
        '@babel/preset-env',
        {
            corejs: 3,
            targets: 'defaults, ie >= 11',
            modules: false,
            useBuiltIns: 'usage',
            debug: false,
        },
    ],
];
exports.default = {
    default: defaultPresets,
    legacy: legacyPresets
};
//# sourceMappingURL=presets.js.map