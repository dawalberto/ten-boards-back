const app = require('express')
const router = app.Router()
const { get, post } = require('../controllers/users')

router.route('/users').get(get).post(post)

module.exports = { router }
