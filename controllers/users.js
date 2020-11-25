const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../database/models/user')

const get = (req, res) => {
	User.find((error, usersDB) => {
		if (error) {
			return res.status(500).json({
				error,
			})
		}
		res.json({
			total: usersDB.length,
			users: usersDB,
		})
	})
}

const post = (req, res) => {
	let { email, password, name, userName, avatarColor, rol, department } = req.body

	if (!password) {
		return res.status(400).json({
			message: 'password cannot be empty',
		})
	}

	let hashedPassword = getHashedPassword(password)

	let user = new User({
		email,
		password: hashedPassword,
		name,
		userName,
		avatarColor,
		rol,
		department,
	})

	user.save((error, userDB) => {
		if (error) {
			return res.status(500).json({
				error,
			})
		}
		res.status(201).json({
			user: userDB,
		})
	})
}

const login = (req, res) => {
	let { email, password } = req.body

	if (!email) {
		return res.status(400).json({
			message: 'email cannot be empty',
		})
	}

	if (!password) {
		return res.status(400).json({
			message: 'password cannot be empty',
		})
	}

	password = '' + password

	User.findOne({ email }, (err, userDB) => {
		if (err) {
			return res.status(500).json({
				error: err,
			})
		}

		if (!userDB) {
			return res.status(401).json({
				message: 'incorrect username or password',
			})
		}

		if (!bcrypt.compareSync(password, userDB.password)) {
			return res.status(401).json({
				message: 'incorrect username or password',
			})
		}

		const user = userDB
		const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: process.env.EXPIRATION_TOKEN,
		})

		res.json({
			user,
			token: accessToken,
			message: 'user successfully logged in',
		})
	})
}

function getHashedPassword(rawPassword) {
	let salt = bcrypt.genSaltSync()
	return bcrypt.hashSync(rawPassword, salt)
}

module.exports = { get, post, login }
