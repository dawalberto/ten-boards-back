const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const expect = chai.expect

chai.should()
chai.use(chaiHttp)

describe('☕️ users', () => {
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
		it('should create and return a valid user with the defined properties on schema', (done) => {
			let email = getRandomEmail()
			let userName = getRandomUserName()
			let department = ['support', 'ecommerce']

			const user = {
				email,
				password: 'qwerty',
				name: userName,
				userName,
				department,
			}

			chai.request(app)
				.post('/users')
				.send(user)
				.end((err, res) => {
					expect(res.statusCode).to.equal(201)
					res.body.should.have.property('user')

					const user = res.body.user

					user.should.be.a('object')
					expect(user).to.include.all.keys(
						'_id',
						'email',
						'userName',
						'name',
						'avatar',
						'rol',
						'department',
						'dateAdded',
						'dateModified'
					)

					expect(user.email).to.be.a('string')
					expect(user.email).to.equal(email)
					expect(user.email).to.match(
						/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
					)

					expect(user.userName).to.be.a('string')
					expect(user.userName).to.equal(userName)

					expect(user.name).to.be.a('string')
					expect(user.name).to.equal(userName)

					expect(user.rol).to.be.a('string')
					expect(user.rol).to.satisfy((rol) => {
						return rol === 'USER' || rol === 'ADMIN'
					})

					expect(user.department).to.be.an('array')
					expect([
						'gid',
						'ecommerce',
						'support',
						'sistems',
						'administration',
						'commercial',
						'itemdoc',
					]).to.include.members(user.department)

					expect(user.avatar).to.be.a('string')
					expect(user.avatar).to.include('<svg')

					expect(user._id).to.be.a('string')
					expect(user.dateAdded).to.be.a('string')
					expect(user.dateModified).to.be.a('string')

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
					expect(res.body.errors).to.include.all.keys('email', 'password', 'name', 'userName')

					done()
				})
		})
	})

	describe('/login okey', () => {
		it('should login user by email and return user, token and message', (done) => {
			let email = getRandomEmail()
			let userName = getRandomUserName()
			let password = 'qwerty'
			let department = ['ecommerce']

			const user = {
				email,
				password,
				name: userName,
				userName,
				department,
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
			let department = ['ecommerce']

			const user = {
				email,
				password,
				name: userName,
				userName,
				department,
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
