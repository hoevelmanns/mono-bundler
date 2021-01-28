import { PackageHash } from './package-hash'
import Loader from './loader'

export interface Constructor<T> extends Function {
    new(...args: any[]): T;
}

export {
    PackageHash,
    Loader
}

export * from './config'
export * from './logger'
