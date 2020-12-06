const app = require('express')
const router = app.Router()
const { get, getById, post, finishBoardById } = require('../controllers/boards')
const { verifyToken } = require('../middlewares/auth')
const { verifyUserOwnerBoard } = require('../middlewares/boards')

router.get('/', verifyToken, get)
router.get('/:id', verifyToken, getById)
router.post('/', verifyToken, post)
router.delete('/:id', [verifyToken, verifyUserOwnerBoard], finishBoardById)

module.exports = { router }
