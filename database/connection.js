const mongoose = require('mongoose')

const connect = (urlConnection) => {
	mongoose.connect(
		urlConnection,
		{
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		(error, response) => {
			if (error) {
				throw error
			}
			console.log('BBDD online')
		}
	)
}

module.exports = { connect }
