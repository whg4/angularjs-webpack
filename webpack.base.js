const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const { length } = require('os').cpus();

const babelPoolOptions = {
	workers: length ? length : 1,
	workerParallelJobs: 50,
	poolTimeout: 2000,
	name: 'babel-pool',
};

const isDev = process.env.environment === 'dev';

const plugins = [
	new webpack.ProgressPlugin(),
	new CleanWebpackPlugin(),
];

if (!isDev) {
	plugins.push(new MiniCssExtractPlugin({
		filename: "static/css/[contenthash].css",
	}));
}

const baseConfig = {
	entry: {
		app: [path.join(__dirname, './src/main.js'), path.join(__dirname, './src/index.styl')],
	},
	output: {
		filename: 'static/js/[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist')
	},
	cache: {
		type: 'filesystem',
		store: 'pack',
		// 推荐设置 cache.buildDependencies.config: [__filename] 来获取最新配置以及所有依赖项。
		// https://webpack.js.org/configuration/cache/#cachebuilddependencies
		buildDependencies: {
			// This makes all dependencies of this file - build dependencies
			config: [__filename],
			// 默认情况下 webpack 与 loader 是构建依赖。
		},
	},
	plugins,
	module: {
		rules: [
			{
				test: /\.lazy\.html$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name(resourcePath, resourceQuery) {
								if (process.env.NODE_ENV === 'development') {
									return '[path][name].[ext]';
								}
								return 'static/html/[contenthash].[ext]';
							},
						},
					},
				],
			},
			{
				test: /\.html$/,
				exclude: /\.lazy\.html$/,
				use: [
					{
						loader: "html-loader",
						options: {
							// 压缩html
							minimize: true,
						}
					},
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'thread-loader',
						options: babelPoolOptions,
					},
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							cacheDirectory: true,
						}
					}
				]
			},
			{
				test: /\.styl$/,
				use: [!isDev ? MiniCssExtractPlugin.loader : "style-loader", "css-loader", 'stylus-loader'],
			},
			{
				test: /\.css$/,
				use: [!isDev ? MiniCssExtractPlugin.loader : "style-loader", "css-loader"],
			}
		]
	},
}

module.exports = {
	baseConfig,
	babelPoolOptions
};