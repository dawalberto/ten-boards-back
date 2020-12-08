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

const verifyUserBelongsBoard = (req, res, next) => {
	const userId = req.user._id
	const boardId = req.body.board || req.params.id

	Board.findById(boardId, (errors, boardDB) => {
		if (errors) {
			return res.status(500).json({
				errors,
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
}

module.exports = { verifyUserOwnerBoard, verifyUserBelongsBoard }
