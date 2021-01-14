export var Config;
(function (Config) {
    Config.Target = {
        default: { name: 'default', extraFileExtension: '', format: 'esm', loaderAttribute: 'elem.type="module"' },
        legacy: { name: 'legacy', extraFileExtension: 'legacy', format: 'iife', loaderAttribute: 'elem.noModule=true' },
    };
    Config.rollupExternals = ['core-js'];
})(Config || (Config = {}));
