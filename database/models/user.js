const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const validRoles = {
	values: ['ADMIN', 'USER'],
	message: '{VALUE} is not a valid role',
}

const validDepartments = {
	values: ['gid', 'ecommerce', 'support', 'sistems', 'administration', 'commercial', 'itemdoc'],
	message: '{VALUE} is not a valid department',
}

const User = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: true,
		unique: true,
	},
	avatar: {
		type: String,
		required: true,
		default: '#f39c12',
	},
	rol: {
		type: String,
		default: 'USER',
		enum: validRoles,
	},
	department: {
		type: [String],
		enum: validDepartments,
		validate: [
			function () {
				return this.department.length >= 1
			},
			'must assign at least one department',
		],
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

User.methods.toJSON = function () {
	const user = this
	const userObject = user.toObject()
	delete userObject.password

	return userObject
}

User.plugin(uniqueValidator, '{PATH} must have unique')
module.exports = mongoose.model('User', User)
