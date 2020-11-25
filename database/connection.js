const mongoose = require('mongoose')

const connect = () => {
	const urlConnection = getUrlConnection()

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
		}
	)
}

function getUrlConnection() {
	switch (process.env.NODE_ENV) {
		case 'dev':
			return process.env.URL_BBDD_DEV
		case 'test':
			return process.env.URL_BBDD_TEST
		case 'pro':
			return process.env.URL_BBDD
	}
}

module.exports = { connect }
