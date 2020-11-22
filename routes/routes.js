const app = require('express')
const router = app.Router()

router.get('/', (req, res) => {
	res.json({
		ok: true,
		msg: 'hey there 😃',
	})
})

module.exports = router
