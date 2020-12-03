const app = require('express')
const router = app.Router()
const { get, post, login } = require('../controllers/users')
const { verifyToken } = require('../middlewares/auth')

router.get('/', verifyToken, get)
router.post('/', post)
router.post('/login', login)

module.exports = { router }
