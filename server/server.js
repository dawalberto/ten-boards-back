require('dotenv').config()
const express = require('express')
const server = express()
const routes = require('../routes')
const connection = require('../database/connection')

server.use(express.json())
server.use(routes)
connection.connect()

module.exports = server
