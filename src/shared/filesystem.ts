import path from 'path'

export const filename = (path: string) => path?.split('/').pop()

export const concatFilename = (filename: string, str: string) => {
	if (str?.length === 0) {
		return filename
	}
	const outputExtension = path.extname(filename)
	return filename.replace(outputExtension, `.${str}${outputExtension}`)
}
