const Board = require('../database/models/board')

const get = (req, res) => {
	const user = req.user

	Board.find({ $or: [{ user: user._id }, { members: user._id }] }, (error, boardsDB) => {
		if (error) {
			return res.status(500).json({
				error,
			})
		}

		let totalBoards = boardsDB.length

		return res.json({
			total: totalBoards,
			boards: boardsDB,
		})
	})
}

const post = (req, res) => {
	let { title, description, totalTime, public, finished, members, background } = req.body

	const user = req.user._id
	const dateAdded = new Date()
	const dateUpdated = new Date()
	members = members ? [user, ...members] : [user]

	let board = new Board({
		title,
		description,
		totalTime,
		public,
		finished,
		user,
		dateAdded,
		dateUpdated,
		members,
		background,
	})

	board.save((errors, boardDB) => {
		if (errors) {
			return res.status(500).json({
				errors,
			})
		}

		return res.status(201).json({
			board: boardDB,
		})
	})
}

module.exports = { get, post }
