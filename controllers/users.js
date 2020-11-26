const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../database/models/user')

const get = (req, res) => {
	User.find((errors, usersDB) => {
		if (errors) {
			return res.status(500).json(errors)
		}
		res.json({
			total: usersDB.length,
			users: usersDB,
		})
	})
}

const post = (req, res) => {
	let { email, password, name, userName, avatarColor, rol, department } = req.body

	let hashedPassword = password ? getHashedPassword('' + password) : ''

	let user = new User({
		email,
		password: hashedPassword,
		name,
		userName,
		avatarColor,
		rol,
		department,
	})

	user.save((errors, userDB) => {
		if (errors) {
			return res.status(500).json(errors)
		}
		res.status(201).json({
			user: userDB,
		})
	})
}

const login = (req, res) => {
	let { email, password } = req.body

	password = '' + password

	User.findOne({ email }, (errors, userDB) => {
		if (errors) {
			return res.status(500).json(errors)
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
