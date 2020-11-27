const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const expect = chai.expect

chai.should()
chai.use(chaiHttp)

describe('/get okey', () => {
	it('should return total users and users array', (done) => {
		chai.request(app)
			.get('/users')
			.end((err, res) => {
				expect(res.statusCode).to.equal(200)
				res.body.should.have.property('total')
				res.body.should.have.property('users')
				expect(isNaN(res.body.total)).to.equal(false)
				expect(Array.isArray(res.body.users)).to.equal(true)
				done()
			})
	})
})

describe('/post okey', () => {
	it('should create and return user', (done) => {
		let email = getRandomEmail()
		let userName = getRandomUserName()

		const user = {
			email,
			password: 'qwerty',
			name: userName,
			userName,
		}

		chai.request(app)
			.post('/users')
			.send(user)
			.end((err, res) => {
				expect(res.statusCode).to.equal(201)
				res.body.should.have.property('user')
				res.body.user.should.be.a('object')

				res.body.user.should.have.property('email')
				res.body.user.email.should.be.a('string')
				expect(res.body.user.email).to.equal(email)

				res.body.user.should.have.property('name')
				res.body.user.name.should.be.a('string')
				expect(res.body.user.name).to.equal(userName)

				res.body.user.should.have.property('userName')
				res.body.user.userName.should.be.a('string')
				expect(res.body.user.userName).to.equal(userName)
				done()
			})
	})
})

describe('/post error', () => {
	it('should return errors object with required properties to create a user', (done) => {
		const user = {}

		chai.request(app)
			.post('/users')
			.send(user)
			.end((err, res) => {
				expect(res.statusCode).to.equal(500)
				res.body.should.have.property('errors')
				res.body.errors.should.have.property('email')
				res.body.errors.should.have.property('password')
				res.body.errors.should.have.property('name')
				res.body.errors.should.have.property('userName')
				done()
			})
	})
})

describe('/login okey', () => {
	it('should login user by email and return user, token and message', (done) => {
		let email = getRandomEmail()
		let userName = getRandomUserName()
		let password = 'qwerty'

		const user = {
			email,
			password,
			name: userName,
			userName,
		}

		chai.request(app)
			.post('/users')
			.send(user)
			.end(() => {
				chai.request(app)
					.post('/users/login')
					.send({ email, password })
					.end((err, res) => {
						expect(res.statusCode).to.equal(200)
						res.body.should.have.property('user')
						res.body.user.should.be.a('object')
						res.body.should.have.property('token')
						res.body.token.should.be.a('string')
						res.body.should.have.property('message')
						res.body.message.should.be.a('string')
						expect(res.body.message).to.equal('user successfully logged in')
						done()
					})
			})
	})

	it('should login user by user name and return user, token and message', (done) => {
		let email = getRandomEmail()
		let userName = getRandomUserName()
		let password = 'qwerty'

		const user = {
			email,
			password,
			name: userName,
			userName,
		}

		chai.request(app)
			.post('/users')
			.send(user)
			.end(() => {
				chai.request(app)
					.post('/users/login')
					.send({ userName, password })
					.end((err, res) => {
						expect(res.statusCode).to.equal(200)
						res.body.should.have.property('user')
						res.body.user.should.be.a('object')
						res.body.should.have.property('token')
						res.body.token.should.be.a('string')
						res.body.should.have.property('message')
						res.body.message.should.be.a('string')
						expect(res.body.message).to.equal('user successfully logged in')
						done()
					})
			})
	})
})

describe('/login error', () => {
	it('should return unauthorized code 401 and message', (done) => {
		let email = 'fakeEmail'
		let password = 'fakePassword'

		chai.request(app)
			.post('/users/login')
			.send({ email, password })
			.end((err, res) => {
				expect(res.statusCode).to.equal(401)
				res.body.should.have.property('message')
				res.body.message.should.be.a('string')
				expect(res.body.message).to.equal('incorrect username or password')
				done()
			})
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
