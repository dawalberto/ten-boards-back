const express = require('express')
const server = express()
const fileupload = require('express-fileupload')
const routes = require('../routes/routes')
require('../config/config')

server.use(express.json())
server.use(fileupload())
server.use(routes)

module.exports = server
