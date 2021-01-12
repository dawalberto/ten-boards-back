const Board = require('../database/models/board')
const Card = require('../database/models/card')
const { getListsFromBoardId, getListByIdSync } = require('./lists')
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

const getSummary = (req, res) => {
	Card.find({ members: req.user._id }, async (error, cardsDB) => {
		if (error) {
			return res.status(500).json({
				errors: error.errors,
			})
		}

		if (!cardsDB) {
			return res.status(400).json({
				message: 'nothing pending',
			})
		}

		const summary = []

		for (let i = 0; i < cardsDB.length; i++) {
			let list = await getListByIdSync(cardsDB[i].list)
			list.cards = [getCardToSummary(cardsDB[i])]

			let board = await getBoardByIdSync(list.board)
			board.lists = [getListToSummary(list)]
			board = getBoardToSummary(board)

			summary.push({ board })
		}

		mergeSummary(summary)

		return res.json({
			summary,
		})
	})
}

const post = (req, res) => {
	let { title, description, public, finished, members, background } = req.body

	const user = req.user._id

	let board = new Board({
		title,
		description,
		public,
		finished,
		user,
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
	let { title, description, user, public, finished, members, background } = req.body

	let board = {
		title,
		description,
		user,
		public,
		finished,
		members,
		background,
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

const getBoardByIdSync = async (boardId) => {
	return await Board.findById(boardId)
}

const getBoardToSummary = (board) => {
	return {
		_id: '' + board._id,
		title: board.title,
		description: board.description,
		user: board.user,
		members: board.members,
		totalTime: board.totalTime,
		updatedAt: board.updatedAt,
		lists: board.lists,
	}
}
const getListToSummary = (list) => {
	return {
		_id: '' + list._id,
		title: list.title,
		cards: list.cards,
	}
}
const getCardToSummary = (card) => {
	return {
		_id: '' + card._id,
		description: card.description,
		members: card.members,
	}
}

const mergeSummary = (summary) => {
	mergeBoardsSummary(summary)
	mergeListsSummary(summary)
}

const mergeBoardsSummary = (summary) => {
	for (let i = 0; i < summary.length; i++) {
		const boardId = summary[i].board._id

		while (summary.filter((e) => e.board._id === boardId).length > 1) {
			let clonedBoard = [...summary]
			clonedBoard.reverse()

			let posBoardToRemove = clonedBoard.findIndex((e) => e.board._id === boardId)
			let listsToSave = clonedBoard[posBoardToRemove].board.lists

			summary[i].board.lists.push(...listsToSave)
			summary.splice(-(posBoardToRemove + 1), 1)
		}
	}
}

const mergeListsSummary = (summary) => {
	for (let i = 0; i < summary.length; i++) {
		for (let j = 0; j < summary[i].board.lists.length; j++) {
			const lists = summary[i].board.lists
			const listId = lists[j]._id

			while (lists.filter((list) => list._id === listId).length > 1) {
				let clonedLists = [...lists]
				clonedLists.reverse()

				let posListToRemove = clonedLists.findIndex((e) => e._id === listId)
				let cardsToSave = clonedLists[posListToRemove].cards

				summary[i].board.lists[j].cards.push(...cardsToSave)
				summary[i].board.lists.splice(-(posListToRemove + 1), 1)
			}
		}
	}
}

module.exports = { get, getById, getSummary, post, put }
