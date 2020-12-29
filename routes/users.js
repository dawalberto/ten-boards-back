const app = require('express')
const router = app.Router()
const { get, getUserLogged, post, login } = require('../controllers/users')
const { verifyToken } = require('../middlewares/auth')

router.get('/', verifyToken, get)
router.get('/me', verifyToken, getUserLogged)
router.post('/', post)
router.post('/login', login)

module.exports = { router }
