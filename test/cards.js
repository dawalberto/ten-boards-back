const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const { correctErrorTokenNotProvided, getRandomSentence } = require('./generics')
const expect = chai.expect

chai.should()
chai.use(chaiHttp)

describe('☕️ cards', () => {
	describe('POST /cards error token not provided', () => {
		it('should get http code 401 and object error.', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((error, res) => {
					chai.request(app)
						.post('/cards')
						.end((error, res) => {
							correctErrorTokenNotProvided(res)
							done()
						})
				})
		})
	})

	describe('POST /cards error unauthorized', () => {
		it('should return http code error 401 and an message', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((error, res) => {
					const token = res.body.token
					const card = {
						description: 'fake description',
						list: '5fcf4ca31444ec0b4ea6d3b8',
					}

					chai.request(app)
						.post('/cards')
						.set('token', token)
						.send(card)
						.end((error, res) => {
							expect(res.statusCode).to.be.equal(401)
							res.body.should.have.property('message')
							expect(res.body.message).to.equal('you do not belong to this board')

							done()
						})
				})
		})
	})

	describe('POST /cards error required list', () => {
		it('should return http code error 500 and an message', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((error, res) => {
					const token = res.body.token

					chai.request(app)
						.post('/cards')
						.set('token', token)
						.send({})
						.end((error, res) => {
							expect(res.statusCode).to.be.equal(500)
							res.body.should.have.property('message')
							expect(res.body.message).to.equal('no list found with id undefined')

							done()
						})
				})
		})
	})

	describe('POST /cards error required fields', () => {
		it('should return http code error 500 and an errors object list', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((error, res) => {
					const token = res.body.token

					chai.request(app)
						.post('/cards')
						.set('token', token)
						.send({ list: '5fcf4c4d17be6f0b17f4403f' })
						.end((error, res) => {
							expect(res.statusCode).to.be.equal(500)
							res.body.should.have.property('errors')
							res.body.errors.should.be.a('object')
							res.body.errors.should.have.property('description')

							done()
						})
				})
		})
	})

	describe('POST /cards error list not found', () => {
		it('should return http code error 500 and an message', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((error, res) => {
					const token = res.body.token
					const card = {
						title: 'TO DO',
						list: '111111111111111111111111',
					}

					chai.request(app)
						.post('/cards')
						.set('token', token)
						.send(card)
						.end((error, res) => {
							expect(res.statusCode).to.be.equal(500)
							res.body.should.have.property('message')
							expect(res.body.message).to.equal('no list found with id 111111111111111111111111')

							done()
						})
				})
		})
	})

	describe('POST /cards okey', () => {
		it('should return http code 201 and list created', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((error, res) => {
					const token = res.body.token
					const description = getRandomSentence(5)

					const list = {
						description,
						list: '5fcf4c4d17be6f0b17f4403f',
					}

					chai.request(app)
						.post('/cards')
						.set('token', token)
						.send(list)
						.end((error, res) => {
							expect(res.statusCode).to.equal(201)
							res.body.should.have.property('card')
							validCard(res.body.card)

							done()
						})
				})
		})
	})
})

function validCard(card, expectedCard) {
	card.should.be.a('object')
	expect(card).to.include.all.keys(
		'_id',
		'list',
		'description',
		'time',
		'members',
		'labels',
		'dateAdded',
		'dateUpdated'
	)

	expect(card._id).to.be.a('string')
	expect(card.list).to.be.a('string')
	expect(card.description).to.be.a('string')
	expect(card.time).to.be.a('number')
	expect(card.members).to.be.a('array')
	expect(card.labels).to.be.a('array')
	expect(card.dateAdded).to.be.a('string')
	expect(card.dateUpdated).to.be.a('string')

	if (expectedCard) {
		expect(card.list).to.equal(expectedCard.list)
		expect(card.description).to.equal(expectedCard.description)
		expect(card.time).to.equal(expectedCard.time)
	}
}
