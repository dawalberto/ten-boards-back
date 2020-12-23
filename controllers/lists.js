const List = require('../database/models/list')
const { getCardsFromListId } = require('./cards')
const { deleteUndefinedPropsOfObject } = require('./utilities')

const post = (req, res) => {
	const { title, board, color } = req.body

	const list = new List({
		title,
		board,
		color,
	})

	list.save((err, listDB) => {
		if (err) {
			return res.status(500).json({
				errors: err.errors,
			})
		}

		return res.status(201).json({
			list: listDB,
		})
	})
}

const put = (req, res) => {
	const listId = req.params.id
	let { title, color } = req.body

	const list = {
		title,
		color,
	}
	deleteUndefinedPropsOfObject(list)

	List.updateOne({ _id: listId }, list, { runValidators: true }, (error, updated) => {
		if (error) {
			return res.status(500).json({
				errors: error.errors,
			})
		}

		if (updated && updated.nModified === 0) {
			return res.status(400).json({
				message: 'nothing to update',
			})
		}

		return res.status(200).json({
			message: 'list updated',
		})
	})
}

const remove = (req, res) => {
	const listId = req.params.id

	List.deleteOne({ _id: listId }, (error, deleted) => {
		if (error) {
			return res.status(500).json({
				errors: error.errors,
			})
		}

		return res.status(200).json({
			message: 'list deleted',
		})
	})
}

const getListsFromBoardId = async (boardId) => {
	const listsDB = await List.find({ board: boardId })
	const lists = []

	listsDB.forEach((list) => {
		lists.push(list.toObject())
	})

	for (const list of lists) {
		list.cards = await getCardsFromListId(list._id)
	}

	return lists
}

module.exports = { post, put, remove, getListsFromBoardId }
