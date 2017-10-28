const fs = require('fs')
const path = require('path')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const postcssPartialImport = require('postcss-partial-import')
const simpleVars = require('postcss-simple-vars')
const stylingVars = require(path.join(process.cwd(), 'config', 'styling-variables.js'))

const srcFilePath = path.join(process.cwd(), 'styles', 'styles.css')
const destFilePath = path.join(process.cwd(), 'out', 'styles', 'styles.css')

fs.readFile(
	srcFilePath
	, (err, css) => {
		if (err) {
			process.stderr.write(err.message)

			return
		}

		postcss([
			postcssPartialImport({})
			, simpleVars({ variables: stylingVars })
			, autoprefixer
		])
			.process(css, { from: srcFilePath, to: destFilePath })
			.then((result) => {
				result.warnings().forEach((warning) => {
					process.stderr.write(warning)
				})


				if (process.env.NODE_ENV === 'production') {
					process.stderr.write('TODO: minify css')
				}

				fs.writeFile(
					destFilePath
					, result.css
					, (err) => {
						if (err) {
							process.stderr.write(err.message)
						}
					}
				)

				if (result.map) {
					fs.writeFile(
						path.join(process.cwd(), 'out', 'styles', 'main.css.map')
						, result.map
						, (err) => {
							if (err) {
								process.stderr.write(err.message)
							}
						}
					)
				}
			})
			.catch((err) => {
				process.stderr.write(err)
			})
	}
)
