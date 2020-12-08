const List = require('../database/models/list')

const post = (req, res) => {
	const { title, board, color } = req.body

	const list = new List({
		title,
		board,
		color,
		dateAdded: new Date(),
		dateUpdated: new Date(),
	})

	list.save((errors, listDB) => {
		if (errors) {
			return res.status(500).json({
				errors,
			})
		}

		return res.status(201).json({
			list: listDB,
		})
	})
}

module.exports = { post }
