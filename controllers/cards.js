const Card = require('../database/models/card')

const post = (req, res) => {
	let { list, description, members, labels } = req.body
	members = members ? [req.user._id, ...members] : [req.user._id]

	const card = new Card({
		list,
		description,
		members,
		labels,
	})

	card.save((error, cardDB) => {
		if (error) {
			return res.status(500).json({
				errors: error.errors,
			})
		}

		return res.status(201).json({
			card: cardDB,
		})
	})
}

module.exports = { post }
