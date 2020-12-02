const app = require('express')
const router = app.Router()
const { get, post } = require('../controllers/boards')
const { verifyToken } = require('../middlewares/auth')

router.get('/', verifyToken, get)
router.post('/', verifyToken, post)

module.exports = { router }
