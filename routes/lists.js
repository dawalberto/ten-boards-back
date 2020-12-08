const app = require('express')
const router = app.Router()
const { verifyToken } = require('../middlewares/auth')
const { verifyUserBelongsBoardByBoard } = require('../middlewares/boards')
const { verifyUserBelongsBoardByList } = require('../middlewares/lists')
const { post, put } = require('../controllers/lists')

router.post('/', [verifyToken, verifyUserBelongsBoardByBoard], post)
router.put('/:id', [verifyToken, verifyUserBelongsBoardByList], put)

module.exports = { router }
