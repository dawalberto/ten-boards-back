const mongoose = require('mongoose')

const List = new mongoose.Schema(
	{
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
	},
	{ timestamps: true }
)

module.exports = mongoose.model('List', List)
