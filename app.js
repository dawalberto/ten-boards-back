const app = require('./server/server')
const PORT = process.env.PORT

app.listen(PORT, () => {
	console.log(`Server listen on port ${PORT}`)
})
