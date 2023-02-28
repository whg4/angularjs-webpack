const { merge } = require('webpack-merge');
const { baseConfig, babelPoolOptions } = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const threadLoader = require('thread-loader');
threadLoader.warmup(babelPoolOptions, ['babel-loader']);

module.exports = merge(baseConfig, {
	mode: "development",
	devtool: "inline-source-map",
	devServer: {
		hot: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: path.join(__dirname, 'public/index.html'),
			inject: "body",
		}),
	]
});