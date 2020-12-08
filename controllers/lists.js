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

const put = (req, res) => {
	const listId = req.params.id
	let { title, color } = req.body
	color = color ? color : '#dfe6e9'

	const list = {
		title,
		color,
		dateUpdated: new Date(),
	}

	List.updateOne({ _id: listId }, list, { runValidators: true }, (error, updated) => {
		if (error) {
			return res.status(500).json({
				errors: error.errors,
			})
		}

		if (updated && updated.nModified === 0) {
			return res.status(400).json({
				message: 'no changes to update',
			})
		}

		return res.status(200).json({
			message: 'list updated',
		})
	})
}

module.exports = { post, put }
