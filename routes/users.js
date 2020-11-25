const app = require('express')
const router = app.Router()
const { get, post, login } = require('../controllers/users')

router.get('/', get)
router.post('/', post)
router.post('/login', login)

module.exports = { router }
