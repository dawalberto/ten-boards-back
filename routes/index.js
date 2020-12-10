const app = require('express')
const router = app.Router()
const users = require('./users')
const boards = require('./boards')
const lists = require('./lists')
const cards = require('./cards')

router.get('/', (req, res) => {
	res.send('Welcome 🚀')
})

router.use('/users', users.router)
router.use('/boards', boards.router)
router.use('/lists', lists.router)
router.use('/cards', cards.router)

module.exports = router
