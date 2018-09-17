// src/mount.webpack.js
const { Router } = require('express');
const path = require('path');

module.exports = app => {
	let expressRouter;
	let buildPromise;
	let contextRequire;

	const getRouter = () => {
		contextRequire = require.context('./routes/', true, /\.express\.js$/);
		const files = contextRequire.keys();
		// Make sure to swap out the router:
		const newRouter = Router();

		files.forEach(file => {
			// Use the new context aware require to include the module:
			const entrypoint = contextRequire(file);
			// Handle ES6 default exports:
			const entrypointRouter = entrypoint.default || entrypoint;
			const mountAt = path.basename(path.dirname(file));
			newRouter.use(`/${mountAt}`, entrypointRouter);
		});
		// Switcheroo
		expressRouter = newRouter;
	};

	// Initial load:
	getRouter();
	// Hot reload the context
	if (module.hot) {
		module.hot.accept(contextRequire.id, getRouter);
	}

	app.use((req, res, next) => {
		// A swappable route handler for HMR updates
		expressRouter(req, res, next);
	});
};
