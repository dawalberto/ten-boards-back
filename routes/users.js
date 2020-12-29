const app = require('express')
const router = app.Router()
const { get, getById, post, login } = require('../controllers/users')
const { verifyToken, verifyUser } = require('../middlewares/auth')

router.get('/', verifyToken, get)
router.get('/:id', [verifyToken, verifyUser], getById)
router.post('/', post)
router.post('/login', login)

module.exports = { router }
