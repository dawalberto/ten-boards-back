const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
	const token = req.get('token')

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decodedToken) => {
		if (error) {
			return res.status(401).json({
				error,
			})
		}

		req.user = decodedToken.user
		next()
	})
}

const verifyUser = (req, res, next) => {
	const id = req.params.id
	const loggedId = req.user._id

	if (id !== loggedId) {
		return res.status(401).json({
			message: 'unauthorized',
		})
	}

	next()
}

module.exports = { verifyToken, verifyUser }
