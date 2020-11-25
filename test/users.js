const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const expect = chai.expect
const should = chai.should()

chai.use(chaiHttp)

describe('/get', () => {
	it('should return total users and users array', async () => {
		const response = await chai.request(app).get('/users')

		expect(response.statusCode).to.equal(200)
		response.body.should.have.property('total')
		response.body.should.have.property('users')
		expect(isNaN(response.body.total)).to.equal(false)
		expect(Array.isArray(response.body.users)).to.equal(true)
	})
})

describe('/post', () => {
	it('should create and return user', async () => {
		let email = getRandomEmail()
		let userName = getRandomUserName()

		const user = {
			email: email,
			password: 'qwerty',
			name: userName,
			userName: userName,
		}

		const response = await chai.request(app).post('/users').send(user)

		expect(response.statusCode).to.equal(201)
		response.body.should.have.property('user')
		response.body.user.should.be.a('object')
	})
})

function getRandomEmail() {
	const letters = 'qwertyuiopasdfghjklzxcvbnm'
	const emailLength = 10
	let email = ''

	for (let i = 0; i <= emailLength; i++) {
		if (i === emailLength / 2) {
			email += '@'
		} else if (i === emailLength) {
			email += '.es'
		} else {
			email += letters[Math.floor(Math.random() * letters.length - 1) + 1]
		}
	}

	return email
}

function getRandomUserName() {
	const letters = 'qwertyuiopasdfghjklzxcvbnm'
	const userNameLength = 2
	let userName = ''

	for (let i = 0; i <= userNameLength; i++) {
		userName += letters[Math.floor(Math.random() * letters.length - 1) + 1]
	}

	return userName
}
