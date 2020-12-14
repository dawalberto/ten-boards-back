const Board = require('../database/models/board')

const verifyUserOwnerBoard = (req, res, next) => {
	const userId = req.user._id
	const boardId = req.params.id

	Board.findById(boardId, (errors, boardDB) => {
		if (errors) {
			return res.status(500).json({
				errors,
			})
		}

		if (boardDB && '' + boardDB.user !== userId) {
			return res.status(401).json({
				message: 'only the owner has permission for this',
			})
		}

		if (!boardDB) {
			return res.status(400).json({
				message: `no board found with id ${boardId}`,
			})
		}

		next()
	})
}

const verifyUserBelongsBoardByBoard = (req, res, next) => {
	const userId = req.user._id
	const boardId = req.body.board || req.params.id

	Board.findById(boardId, (errors, boardDB) => {
		if (errors) {
			return res.status(500).json({
				errors,
			})
		}

		if (!boardDB) {
			return res.status(500).json({
				message: `no board found with id ${boardId}`,
			})
		}

		if ('' + boardDB.user !== userId && !boardDB.members.includes(userId)) {
			return res.status(401).json({
				message: 'you do not belong to this board',
			})
		}

		next()
	})
}

module.exports = { verifyUserOwnerBoard, verifyUserBelongsBoardByBoard }
