"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var Config;
(function (Config) {
    Config.Target = {
        default: { name: 'default', extraFileExtension: '', format: 'esm', loaderAttribute: 'elem.type="module"' },
        legacy: { name: 'legacy', extraFileExtension: 'legacy', format: 'iife', loaderAttribute: 'elem.noModule=true' },
    };
    Config.rollupExternals = ['core-js'];
})(Config = exports.Config || (exports.Config = {}));
//# sourceMappingURL=config.js.map