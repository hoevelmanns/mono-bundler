import { hashElement } from 'folder-hash'

export class PackageHash {
	
	/**
	 * @param {string} packageDir
	 */
	constructor(private readonly packageDir: string) {
	}
	
	/**
	 * @returns {Promise<string>}
	 */
	async generate(): Promise<string> {
		const options = {
			folders: { exclude: ['dist'] },
			files: { exclude: ['package.json'] },
		}

		return (await hashElement(this.packageDir, options)).hash
			.toString()
			.replace(/[^a-z0-9]/gi, '')
			.slice(0, 16)
			.toLowerCase()
	}
}
