require('../config/config')
const express = require('express')
const server = express()
const routes = require('../routes')
const connection = require('../database/connection')

server.use(express.json())
server.use(routes)
connection.connect(process.env.URLBBDD)

module.exports = server
