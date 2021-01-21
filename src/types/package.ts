export interface Browser {
    umd?: string,
    esm?: string
}

export interface Directories {
    source?: string
}

export interface Engines {
    node?: { [key: string]: string },
    npm?: { [key: string]: string },

    [key: string]: any
}

export interface Scripts {
    build?: string,
    watch?: string
}