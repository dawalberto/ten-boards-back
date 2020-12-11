const Card = require('../database/models/card')
const List = require('../database/models/list')
const Board = require('../database/models/board')

const verifyUserBelongsBoardByCard = (req, res, next) => {
	const userId = req.user._id
	const cardId = req.params.id

	Card.findById(cardId, (error, cardDB) => {
		if (error) {
			return res.status(500).json({
				errors: error.erros,
			})
		}

		if (!cardDB) {
			return res.status(500).json({
				message: `no card found with id ${cardId}`,
			})
		}

		const listId = cardDB.list

		List.findById(listId, (error, listDB) => {
			if (error) {
				return res.status(500).json({
					errors: error.erros,
				})
			}

			if (!listDB) {
				return res.status(500).json({
					message: `no list found with id ${listId}`,
				})
			}

			const boardId = listDB.board

			Board.findById(boardId, (error, boardDB) => {
				if (error) {
					return res.status(500).json({
						errors: error.erros,
					})
				}

				if (boardDB && boardDB.user !== userId && !boardDB.members.includes(userId)) {
					return res.status(401).json({
						message: 'you do not belong to this board',
					})
				}

				if (!boardDB) {
					return res.status(500).json({
						message: `no board found with id ${boardId}`,
					})
				}

				next()
			})
		})
	})
}

module.exports = { verifyUserBelongsBoardByCard }
