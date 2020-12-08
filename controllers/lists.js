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

module.exports = { post }
