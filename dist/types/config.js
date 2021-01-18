"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollupExternals = exports.target = exports.Targets = void 0;
exports.Targets = [
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
 * @returns Target
 */
const target = (name) => {
    return exports.Targets.find(t => t.type === name);
};
exports.target = target;
exports.rollupExternals = ['core-js'];
//# sourceMappingURL=config.js.map