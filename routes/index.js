const app = require('express')
const router = app.Router()
const users = require('./users')
const boards = require('./boards')

router.get('/', (req, res) => {
	res.send('Welcome 🚀')
})

router.use('/users', users.router)
router.use('/boards', boards.router)

module.exports = router
