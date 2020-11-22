const app = require('express')
const router = app.Router()
const users = require('./users')

router.get('/', (req, res) => {
	res.send('Welcome 🚀')
})

router.use(users.router)

module.exports = router
