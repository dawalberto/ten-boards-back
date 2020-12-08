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

const getById = (req, res) => {
	const boardId = req.params.id

	Board.findById(boardId, (error, boardDB) => {
		if (error) {
			return res.status(500).json({
				error,
			})
		}

		return res.json({
			board: boardDB,
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

const finishBoardById = (req, res) => {
	const boardId = req.params.id

	Board.updateOne({ _id: boardId }, { finished: true }, (errors, updated) => {
		if (errors) {
			return res.status(500).json({
				errors,
			})
		}

		if (updated && updated.nModified === 0) {
			return res.status(400).json({
				message: 'board already finished',
			})
		}

		return res.status(200).json({
			message: 'board finished',
		})
	})
}

module.exports = { get, getById, post, finishBoardById }
