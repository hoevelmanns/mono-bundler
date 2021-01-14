import Workspace from './workspace';
import Logger from './libs/logger';
import Plugins from './plugins';
import Loader from './loader';
export default class MonoBundler {
    /**
     *
     * @param {Config.BuildOptions} buildOptions
     */
    constructor(buildOptions) {
        this.buildOptions = buildOptions;
        this.rollupConfigurations = [];
        this.workspace = new Workspace(this.buildOptions);
        this.plugins = new Plugins(this.buildOptions);
        this.log = new Logger(this.buildOptions.silent);
        this.noRollupOptions = ['packages', 'createLoaders', 'hashFileNames'];
        /**
         *
         * @private
         * @returns void
         */
        this.buildRollupConfig = () => {
            const packages = this.workspace.packages;
            const external = id => id.includes('core-js'); // todo merge with this.config
            packages.filter(pkg => pkg.isModified).map((pkg) => pkg.output.map(output => this.rollupConfigurations.push(Object.assign(Object.assign({}, this.cleanRollupOptions), {
                plugins: this.plugins.get(output.name),
                input: pkg.input,
                external,
                output,
            }))));
            if (!this.rollupConfigurations.length) {
                this.log.success('All package bundles are present and up-to-date. Nothing to do.');
            }
        };
    }
    async build() {
        await this.workspace.init();
        this.buildRollupConfig();
        this.generateLoaders();
        return this.rollupConfigurations.length
            ? this.rollupConfigurations
            : process.exit(0);
    }
    /**
     *
     * @private
     */
    get cleanRollupOptions() {
        const rollupOptions = Object.assign({}, this.buildOptions);
        this.noRollupOptions.map(key => Reflect.deleteProperty(rollupOptions, key));
        return rollupOptions;
    }
    /**
     *
     * @private
     * @returns void
     */
    generateLoaders() {
        this.workspace.options.createLoaders && this.workspace.modifiedPackages
            .map(async ({ distDir, output, hash }) => new Loader(output).output(distDir, hash));
    }
}
