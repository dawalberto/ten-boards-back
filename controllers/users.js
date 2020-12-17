const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')
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

const post = async (req, res) => {
	let { email, password, name, userName, rol, departments } = req.body

	let hashedPassword = password ? getHashedPassword('' + password) : ''
	let avatar = userName ? await getAvatarByUserName(userName) : ''

	let user = new User({
		email,
		password: hashedPassword,
		name,
		userName,
		avatar,
		rol,
		departments,
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
	let { email, userName, password } = req.body

	password = '' + password

	User.findOne({ $or: [{ email }, { userName }] }, (errors, userDB) => {
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

const getListMembersObject = async (membersId) => {
	const membersList = []
	for (const memberId of membersId) {
		let memberObject = await User.findById(memberId)
		membersList.push(memberObject)
	}
	return membersList
}

const getUserObject = async (userId) => {
	return await User.findById(userId)
}

const getHashedPassword = (rawPassword) => {
	let salt = bcrypt.genSaltSync()
	return bcrypt.hashSync(rawPassword, salt)
}

const getAvatarByUserName = async (userName) => {
	const response = await axios.get(`https://api.multiavatar.com/v1/${JSON.stringify(userName)}`)
	return response.data
}

module.exports = { get, post, login, getListMembersObject, getUserObject }
