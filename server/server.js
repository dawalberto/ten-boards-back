const express = require('express')
const server = express()
const routes = require('../routes/routes')
const mongoose = require('mongoose')
require('../config/config')

server.use(express.json())
server.use(routes)

mongoose.connect(
	process.env.URLBBDD,
	{
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(error, response) => {
		if (error) {
			throw error
		}
		console.log('BBDD online')
	}
)

module.exports = server
