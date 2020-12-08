const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const { correctErrorTokenNotProvided } = require('./generics')
const expect = chai.expect

chai.should()
chai.use(chaiHttp)

describe('☕️ users', () => {
	describe('GET /users error token not provided', () => {
		it('should return http code 401 and object error', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((err, res) => {
					chai.request(app)
						.get('/users')
						.end((err, res) => {
							correctErrorTokenNotProvided(res)
							done()
						})
				})
		})
	})

	describe('GET /users okey', () => {
		it('should return total users and users array', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((err, res) => {
					const token = res.body.token
					chai.request(app)
						.get('/users')
						.set('token', token)
						.end((err, res) => {
							expect(res.statusCode).to.equal(200)
							res.body.should.have.property('total')
							res.body.should.have.property('users')
							expect(isNaN(res.body.total)).to.equal(false)
							expect(Array.isArray(res.body.users)).to.equal(true)

							if (res.body.users.length !== 0) {
								validUser(res.body.users[0])
							}

							done()
						})
				})
		})
	})

	describe('POST /users error token not provided', () => {
		it('should return http code 401 and object error', (done) => {
			chai.request(app)
				.post('/users')
				.end((err, res) => {
					chai.request(app)
						.get('/users')
						.end((err, res) => {
							correctErrorTokenNotProvided(res)
							done()
						})
				})
		})
	})

	describe('POST /users error', () => {
		it('should return errors object with required properties to create a user', (done) => {
			const user = {}

			chai.request(app)
				.post('/users')
				.send(user)
				.end((err, res) => {
					expect(res.statusCode).to.equal(500)

					res.body.should.have.property('errors')
					expect(res.body.errors).to.include.all.keys('email', 'password', 'name', 'userName')

					done()
				})
		})
	})

	describe('POST /users okey', () => {
		it('should create and return a valid user with the defined properties on schema', function (done) {
			let email = getRandomEmail()
			let userName = getRandomUserName()
			let departments = ['support', 'ecommerce']

			const user = {
				email,
				password: 'qwerty',
				name: userName,
				userName,
				departments,
			}

			this.timeout(3000)
			chai.request(app)
				.post('/users')
				.send(user)
				.end((err, res) => {
					expect(res.statusCode).to.equal(201)
					res.body.should.have.property('user')
					validUser(res.body.user, user)

					done()
				})
		})
	})

	describe('POST /users/login error', () => {
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

	describe('POST /users/login okey', () => {
		it('should login user by email and return user, token and message', (done) => {
			let email = 'alberto@test.es'
			let password = 'qwerty'

			chai.request(app)
				.post('/users/login')
				.send({ email, password })
				.end((err, res) => {
					expect(res.statusCode).to.equal(200)
					expect(res.body).to.include.all.keys('user', 'token', 'message')

					validUser(res.body.user)
					res.body.token.should.be.a('string')
					res.body.message.should.be.a('string')
					expect(res.body.message).to.equal('user successfully logged in')

					done()
				})
		})

		it('should login user by user name and return user, token and message', (done) => {
			let userName = 'GH'
			let password = 'qwerty'

			chai.request(app)
				.post('/users/login')
				.send({ userName, password })
				.end((err, res) => {
					expect(res.statusCode).to.equal(200)
					expect(res.body).to.include.all.keys('user', 'token', 'message')

					validUser(res.body.user)
					res.body.token.should.be.a('string')
					res.body.message.should.be.a('string')
					expect(res.body.message).to.equal('user successfully logged in')

					done()
				})
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

function validUser(user, expectedUser) {
	user.should.be.a('object')
	expect(user).to.include.all.keys(
		'_id',
		'email',
		'userName',
		'name',
		'avatar',
		'rol',
		'departments',
		'dateAdded',
		'dateUpdated'
	)

	expect(user.email).to.be.a('string')
	expect(user.email).to.match(
		/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
	)
	expect(user.userName).to.be.a('string')
	expect(user.name).to.be.a('string')
	expect(user.rol).to.be.a('string')
	expect(user.rol).to.satisfy((rol) => {
		return rol === 'USER' || rol === 'ADMIN'
	})
	expect(user.departments).to.be.an('array')
	expect(['gid', 'ecommerce', 'support', 'sistems', 'administration', 'commercial', 'itemdoc']).to.include.members(
		user.departments
	)
	expect(user.avatar).to.be.a('string')
	expect(user.avatar).to.include('<svg')
	expect(user._id).to.be.a('string')
	expect(user.dateAdded).to.be.a('string')
	expect(user.dateUpdated).to.be.a('string')

	if (expectedUser) {
		expect(user.email).to.equal(expectedUser.email)
		expect(user.userName).to.equal(expectedUser.userName)
		expect(user.name).to.equal(expectedUser.userName)
	}
}
