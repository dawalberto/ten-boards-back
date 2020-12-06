const mongoose = require('mongoose')

const List = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	board: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	color: {
		type: String,
		required: true,
		default: '#dfe6e9',
	},
	dateAdded: {
		type: Date,
		default: Date.now,
	},
	dateUpdated: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('List', List)
