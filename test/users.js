const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const expect = chai.expect

chai.should()
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

describe('/post ✅', () => {
	it('should create and return user', async () => {
		let email = getRandomEmail()
		let userName = getRandomUserName()

		const user = {
			email,
			password: 'qwerty',
			name: userName,
			userName,
		}

		const response = await chai.request(app).post('/users').send(user)

		expect(response.statusCode).to.equal(201)
		response.body.should.have.property('user')
		response.body.user.should.be.a('object')
	})
})

describe('/post ❌', () => {
	it('should return errors object with required properties to create a user', async () => {
		const user = {}
		const response = await chai.request(app).post('/users').send(user)

		expect(response.statusCode).to.equal(500)
		response.body.should.have.property('errors')
		response.body.errors.should.have.property('email')
		response.body.errors.should.have.property('password')
		response.body.errors.should.have.property('name')
		response.body.errors.should.have.property('userName')
	})
})

describe('/login ✅', () => {
	it('should login user and return user, token and message', async () => {
		let email = getRandomEmail()
		let userName = getRandomUserName()
		let password = 'qwerty'

		const user = {
			email,
			password,
			name: userName,
			userName,
		}

		await chai.request(app).post('/users').send(user)
		const response = await chai.request(app).post('/users/login').send({ email, password })

		expect(response.statusCode).to.equal(200)
		response.body.should.have.property('user')
		response.body.user.should.be.a('object')
		response.body.should.have.property('token')
		response.body.token.should.be.a('string')
		response.body.should.have.property('message')
		response.body.message.should.be.a('string')
		expect(response.body.message).to.equal('user successfully logged in')
	})
})

describe('/login ❌', () => {
	it('should return unauthorized code 401 and message', async () => {
		let email = 'fakeEmail'
		let password = 'fakePassword'
		const response = await chai.request(app).post('/users/login').send({ email, password })

		expect(response.statusCode).to.equal(401)
		response.body.should.have.property('message')
		response.body.message.should.be.a('string')
		expect(response.body.message).to.equal('incorrect username or password')
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
