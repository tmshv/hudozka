const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const targetDir = path.resolve(__dirname, 'public')

module.exports = {
	entry: {
		app: './src/public/app.js',
	},
	output: {
		path: targetDir,
		filename: '[name].js',
	},

	devtool: 'cheap-module-source-map',

	module: {
		rules: [
			{
				test: /\.jsx?/,
				use: [{
					loader: 'babel-loader',
					options: {
						babelrc: false,
						presets: [
							['@babel/preset-env', {
								'targets': {
									'browsers': [
										'last 2 Chrome versions',
										'last 2 Safari versions',
										'last 2 Firefox versions',
										'last 2 Edge versions',
									]
								}
							}]
						],

						plugins: [
							'@babel/plugin-proposal-object-rest-spread',
							'@babel/plugin-proposal-class-properties',
							'transform-react-jsx',
						]
					},
				}]
			},

			{
				test: /\.less/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'less-loader',
						options: {
							root: true
						},
					},
				]
			}
		],
	},

	plugins: [

	]
}
