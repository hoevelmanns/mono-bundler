export interface Directories {
	source?: string
}

export interface Engines {
	node?: { [key: string]: string },
	npm?: { [key: string]: string },
	rollup?: { [key: string]: string }
	[key: string]: any
}

export interface Scripts {
	build?: string,
	watch?: string
}

export interface TsConfig {
	compilerOptions: {
		target: 'es6' | 'es2015' | 'esnext' | 'es2020',
		moduleResolution: 'node' | 'classic',
		resolveJsonModule: boolean,
		[key: string]: any
	},
	include: string[],
	exclude: string[]
}