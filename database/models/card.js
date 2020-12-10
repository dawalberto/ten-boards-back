const mongoose = require('mongoose')

const defaultLabelds = [
	{
		color: 'green',
		value: '',
	},
	{
		color: 'yellow',
		value: '',
	},
	{
		color: 'orange',
		value: '',
	},
	{
		color: 'red',
		value: '',
	},
	{
		color: 'purple',
		value: '',
	},
	{
		color: 'blue',
		value: '',
	},
]

const Card = new mongoose.Schema({
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
	},
	members: {
		type: [mongoose.Schema.Types.ObjectId],
		required: true,
	},
	labels: {
		type: [Object],
		default: defaultLabelds,
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

module.exports = mongoose.model('Card', Card)
