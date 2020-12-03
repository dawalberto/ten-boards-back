const app = require('express')
const router = app.Router()
const { get, getById, post } = require('../controllers/boards')
const { verifyToken } = require('../middlewares/auth')

router.get('/', verifyToken, get)
router.get('/:id', verifyToken, getById)
router.post('/', verifyToken, post)

module.exports = { router }
