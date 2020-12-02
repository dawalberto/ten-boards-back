const app = require('express')
const router = app.Router()
const { get, post } = require('../controllers/boards')

router.get('/', get)
router.post('/', post)

module.exports = { router }
