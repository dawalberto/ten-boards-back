const app = require('express')
const router = app.Router()
const { verifyToken } = require('../middlewares/auth')
const { verifyUserBelongsBoard } = require('../middlewares/boards')
const { post } = require('../controllers/lists')

router.post('/', [verifyToken, verifyUserBelongsBoard], post)

module.exports = { router }
