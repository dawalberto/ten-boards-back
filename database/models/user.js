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
	},
	dateAdded: {
		type: Date,
		default: Date.now,
	},
	dateModified: {
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
