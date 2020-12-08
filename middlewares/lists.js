const List = require('../database/models/list')
const Board = require('../database/models/board')

const verifyUserBelongsBoardByList = (req, res, next) => {
	const userId = req.user._id
	const listId = req.params.id

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
}

module.exports = { verifyUserBelongsBoardByList }
