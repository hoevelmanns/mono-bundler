import {Logger} from 'shared'
import {autoInjectable, container, inject} from 'tsyringe'
import {Options} from "./options"
import {Packages} from "./packages"

@autoInjectable()
export class Workspace {

    constructor(
        @inject('Options') protected readonly options?: Options,
        @inject('Packages') protected readonly packages?: Packages,
        @inject('Logger') protected readonly logger?: Logger
    ) {
    }

    async init(): Promise<Workspace> {

        this.showReport()

        return this
    }

    /**
     *
     * @private
     * @returns void
     */
    private showReport(): void {
        const {count, dependencies, modified} = this.packages
        this.logger.info(`Found packages: ${count}`)
        this.logger.info(`Found dependencies: ${dependencies.length}`)

        modified.length && this.logger.info('Modified packages:')
        modified.map(({name}) => this.logger.yellow(`- ${name}`))
    }
}

export const workspace = async () => container.register<Workspace>('Workspace', {useValue: await new Workspace().init()})