const app = require('express')
const router = app.Router()
const { verifyToken } = require('../middlewares/auth')
const { verifyUserBelongsBoardByList } = require('../middlewares/lists')
const { post } = require('../controllers/cards')

router.post('/', [verifyToken, verifyUserBelongsBoardByList], post)

module.exports = { router }
