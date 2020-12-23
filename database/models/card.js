const mongoose = require('mongoose')

const defaultLabelds = [
	{
		color: 'green',
		value: '',
		active: false,
	},
	{
		color: 'yellow',
		value: '',
		active: false,
	},
	{
		color: 'orange',
		value: '',
		active: false,
	},
	{
		color: 'red',
		value: '',
		active: false,
	},
	{
		color: 'purple',
		value: '',
		active: false,
	},
	{
		color: 'blue',
		value: '',
		active: false,
	},
]

const Card = new mongoose.Schema(
	{
		list: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		time: {
			type: Number,
			default: 0,
			required: true,
		},
		members: {
			type: [mongoose.Schema.Types.ObjectId],
			required: true,
		},
		labels: {
			type: [Object],
			default: defaultLabelds,
			required: true,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Card', Card)
