const Card = require('../database/models/card')
const { deleteUndefinedPropsOfObject } = require('./utilities')

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

const put = (req, res) => {
	const cardId = req.params.id
	let { list, description, time, members, labels } = req.body
	members = members ? [req.user._id, ...members] : [req.user._id]

	const card = {
		list,
		description,
		time,
		members,
		labels,
	}
	deleteUndefinedPropsOfObject(card)

	Card.findById(cardId, (error, cardDB) => {
		if (error) {
			return res.status(500).json({
				errors: error.errors,
			})
		}

		if (!cardDB) {
			return res.status(500).json({
				message: `no card found with id ${cardId}`,
			})
		}

		Card.updateOne({ _id: cardId }, card, { runValidators: true }, (error, updated) => {
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
				message: 'card updated',
			})
		})
	})
}

const remove = (req, res) => {
	const cardId = req.params.id

	Card.deleteOne({ _id: cardId }, (error, deleted) => {
		if (error) {
			return res.status(500).json({
				errors: error.errors,
			})
		}

		return res.status(200).json({
			message: 'card deleted',
		})
	})
}

const getCardsFromListId = async (listId) => {
	return await Card.find({ list: listId })
}

module.exports = { post, put, remove, getCardsFromListId }
