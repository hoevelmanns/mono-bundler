"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollupExternals = exports.getBundle = exports.Bundles = void 0;
exports.Bundles = [
    {
        type: 'default',
        extraFileExtension: '',
        format: 'esm',
        LoaderElemAttributes: [{ name: 'type', value: 'module' }],
    },
    {
        type: 'legacy',
        extraFileExtension: 'legacy',
        format: 'iife',
        LoaderElemAttributes: [{ name: 'noModule', value: 'true' }],
    },
];
/**
 *
 * @param {string} name
 * @returns Bundle
 */
const getBundle = (name) => {
    return exports.Bundles.find(t => t.type === name);
};
exports.getBundle = getBundle;
exports.rollupExternals = ['core-js'];
