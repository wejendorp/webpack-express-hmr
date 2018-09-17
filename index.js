const express = require('express');
const app = express();
app.use(require('body-parser').json());

const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
	const webpack = require('webpack');
	const webpackConfig = require('./webpack/webpack.config.server.js');

	const buildPromise = new Promise(resolve => {
		const compiler = webpack(webpackConfig);
		compiler.watch({ filename: '.' }, function(err, stats) {
			if (err) {
				console.error(err);
			}
			resolve();
		});
	}).then(() => {
		// Mount the routes when ready (and only once via promise semantics):
		require('./.build/server').mount(app);
	});

	// waitForBuild middleware to avoid confusing 404s
	app.use((req, res, next) => {
		buildPromise.then(next, next);
	});
} else {
	// In production mode, load it as before:
	require('./.build/server').mount(app);
}

app.listen(3000);
