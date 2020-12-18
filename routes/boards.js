const app = require('express')
const router = app.Router()
const { get, getById, post, put } = require('../controllers/boards')
const { verifyToken } = require('../middlewares/auth')
const { verifyUserOwnerBoard, verifyUserBelongsBoardByBoard } = require('../middlewares/boards')

router.get('/', verifyToken, get)
router.get('/:id', [verifyToken, verifyUserBelongsBoardByBoard], getById)
router.post('/', verifyToken, post)
router.put('/:id', [verifyToken, verifyUserOwnerBoard], put)

module.exports = { router }
