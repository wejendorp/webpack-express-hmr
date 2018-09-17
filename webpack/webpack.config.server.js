// webpack/webpack.config.server.js
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	entry: ['webpack/hot/poll?1000', './src/mount.webpack'],
	target: 'node',
	output: {
		path: path.join(__dirname, '../.build'),
		filename: 'server.js',
		// expose main method as:
		library: 'mount',
    // Build it as a commonjs library so we can include it
		libraryTarget: 'commonjs'
  },
	// Don't bundle node_modules, they'll be available at runtime
	externals: [
		nodeExternals({
			// Include the hot reload polling code in the bundle though
			whitelist: ['webpack/hot/poll?1000']
		})
	],
	module: {
		rules: [
			{
				test: /\.js?$/,
				use: 'babel-loader',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	]
};
