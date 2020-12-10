const app = require('express')
const router = app.Router()
const { verifyToken } = require('../middlewares/auth')
const { verifyUserBelongsBoardByList } = require('../middlewares/lists')
const { verifyUserBelongsBoardByCard } = require('../middlewares/cards')
const { post, put } = require('../controllers/cards')

router.post('/', [verifyToken, verifyUserBelongsBoardByList], post)
router.put('/:id', [verifyToken, verifyUserBelongsBoardByList, verifyUserBelongsBoardByCard], put)

module.exports = { router }
