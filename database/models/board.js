const mongoose = require('mongoose')

const Board = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		totalTime: {
			type: Number,
			default: 0,
		},
		public: {
			type: Boolean,
			default: false,
		},
		finished: {
			type: Boolean,
			default: false,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		members: {
			type: [mongoose.Schema.Types.ObjectId],
			required: true,
		},
		background: {
			type: String,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Board', Board)
