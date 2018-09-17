// src/routes/auth/login.express.js
const router = require('express').Router();

router.post('/', function login(req, res, next) {
	// Super secure example login:
	if (req.body.username === 'admin' && req.body.password === 'letmein') {
		// req.session.authenticated = true;
		res.json({ status: 'success'});
	} else {
		res.status(401);
		res.json({ status: 'invalid login'});
	}
});

module.exports = router;
