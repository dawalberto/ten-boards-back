const Board = require('../database/models/board')
const { getListsFromBoardId } = require('./lists')
const { getListMembersObject, getUserObject } = require('./users')
const { deleteUndefinedPropsOfObject } = require('./utilities')

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

	Board.findById(boardId, async (error, boardDB) => {
		if (error) {
			return res.status(500).json({
				error,
			})
		}

		const board = boardDB.toObject()
		board.user = await getUserObject(board.user)
		board.members = await getListMembersObject(board.members)
		board.lists = await getListsFromBoardId(board._id)

		return res.json({
			board,
		})
	})
}

const post = (req, res) => {
	let { title, description, public, finished, members, background } = req.body

	const user = req.user._id
	const dateAdded = new Date()
	const dateUpdated = new Date()

	let board = new Board({
		title,
		description,
		public,
		finished,
		user,
		dateAdded,
		dateUpdated,
		members,
		background,
	})

	board.save((err, boardDB) => {
		if (err) {
			return res.status(500).json({
				errors: err.errors,
			})
		}

		return res.status(201).json({
			board: boardDB,
		})
	})
}

const put = (req, res) => {
	const boardId = req.params.id
	let { title, description, user, public, members, background } = req.body

	let board = {
		title,
		description,
		user,
		public,
		members,
		background,
		dateUpdated: new Date(),
	}
	deleteUndefinedPropsOfObject(board)

	Board.updateOne({ _id: boardId }, board, (errors, updated) => {
		if (errors) {
			return res.status(500).json({
				errors,
			})
		}

		if (updated && updated.nModified === 0) {
			return res.status(400).json({
				message: 'nothing to update',
			})
		}

		return res.status(200).json({
			message: 'board updated',
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

module.exports = { get, getById, post, put, finishBoardById }
