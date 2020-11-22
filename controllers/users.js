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
	const body = req.body
	let { email, password, name, userName, avatarColor, rol, department } = body
	let user = new User({
		email,
		password,
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

module.exports = { get, post }
