const app = require('express')
const router = app.Router()
const { verifyToken } = require('../middlewares/auth')
const { verifyUserBelongsBoardByList } = require('../middlewares/lists')
const { verifyUserBelongsBoardByCard } = require('../middlewares/cards')
const { post, put, remove } = require('../controllers/cards')

router.post('/', [verifyToken, verifyUserBelongsBoardByList], post)
router.put('/:id', [verifyToken, verifyUserBelongsBoardByList], put)
router.delete('/:id', [verifyToken, verifyUserBelongsBoardByCard], remove)

module.exports = { router }
