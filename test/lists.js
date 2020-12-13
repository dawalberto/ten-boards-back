const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const { correctErrorTokenNotProvided, getRandomSentence } = require('./generics')
const expect = chai.expect

chai.should()
chai.use(chaiHttp)

describe('☕️ lists', () => {
	let token

	before((done) => {
		chai.request(app)
			.post('/users/login')
			.send({ email: 'alberto@test.es', password: 'qwerty' })
			.end((err, res) => {
				token = res.body.token
				done()
			})
	})

	describe('POST /lists error token not provided', () => {
		it('should get http code 401 and object error.', (done) => {
			chai.request(app)
				.post('/lists')
				.end((error, res) => {
					correctErrorTokenNotProvided(res)
					done()
				})
		})
	})

	describe('POST /lists error unauthorized', () => {
		it('should return http code error 401 and an message', (done) => {
			const list = {
				title: 'TO DO',
				board: '5fc811de07c54822a1096202',
			}

			chai.request(app)
				.post('/lists')
				.set('token', token)
				.send(list)
				.end((error, res) => {
					expect(res.statusCode).to.be.equal(401)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('you do not belong to this board')

					done()
				})
		})
	})

	describe('POST /lists error required board', () => {
		it('should return http code error 500 and an message', (done) => {
			chai.request(app)
				.post('/lists')
				.set('token', token)
				.send({})
				.end((error, res) => {
					expect(res.statusCode).to.be.equal(500)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('no board found with id undefined')

					done()
				})
		})
	})

	describe('POST /lists error required fields', () => {
		it('should return http code error 500 and an errors object list', (done) => {
			chai.request(app)
				.post('/lists')
				.set('token', token)
				.send({ board: '5fc811770d953d222c2aef92' })
				.end((error, res) => {
					expect(res.statusCode).to.be.equal(500)
					res.body.should.have.property('errors')
					res.body.errors.should.be.a('object')
					res.body.errors.should.have.property('title')

					done()
				})
		})
	})

	describe('POST /lists error board not found', () => {
		it('should return http code error 500 and an message', (done) => {
			const list = {
				title: 'TO DO',
				board: '111111111111111111111111',
			}

			chai.request(app)
				.post('/lists')
				.set('token', token)
				.send(list)
				.end((error, res) => {
					expect(res.statusCode).to.be.equal(500)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('no board found with id 111111111111111111111111')

					done()
				})
		})
	})

	describe('POST /lists okey', () => {
		it('should return http code 201 and list created', (done) => {
			const title = getRandomSentence()

			const list = {
				title,
				board: '5fc811770d953d222c2aef92',
			}

			chai.request(app)
				.post('/lists')
				.set('token', token)
				.send(list)
				.end((error, res) => {
					expect(res.statusCode).to.equal(201)
					res.body.should.have.property('list')
					validList(res.body.list)

					done()
				})
		})
	})

	describe('PUT /lists/:id error token not provided', () => {
		it('should get http code 401 and object error.', (done) => {
			chai.request(app)
				.put('/lists/111111111111111111111111')
				.end((error, res) => {
					correctErrorTokenNotProvided(res)
					done()
				})
		})
	})

	describe('PUT /lists/:id error unauthorized', () => {
		it('should return http code error 401 and an message', (done) => {
			const title = getRandomSentence()

			const list = {
				title,
				board: '5fc811de07c54822a1096202',
			}

			chai.request(app)
				.put('/lists/5fcf4ca31444ec0b4ea6d3b8')
				.set('token', token)
				.send(list)
				.end((error, res) => {
					expect(res.statusCode).to.be.equal(401)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('you do not belong to this board')

					done()
				})
		})
	})

	describe('PUT /lists/:id error list not found', () => {
		it('should return http code error 500 and an message', (done) => {
			chai.request(app)
				.put('/lists/111111111111111111111111')
				.set('token', token)
				.send({})
				.end((error, res) => {
					expect(res.statusCode).to.be.equal(500)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('no list found with id 111111111111111111111111')

					done()
				})
		})
	})

	describe('PUT /lists/:id error required fields', () => {
		it('should return http code error 500 and an errors object list', (done) => {
			chai.request(app)
				.put('/lists/5fcf4c4d17be6f0b17f4403f')
				.set('token', token)
				.send({})
				.end((error, res) => {
					expect(res.statusCode).to.be.equal(500)
					res.body.should.have.property('errors')
					res.body.errors.should.be.a('object')

					done()
				})
		})
	})

	describe('PUT /lists/:id okey', () => {
		it('should return http code 200 and message', (done) => {
			const title = getRandomSentence()

			const list = {
				title,
				color: '#e056fd',
			}

			chai.request(app)
				.put('/lists/5fcf4c4d17be6f0b17f4403f')
				.set('token', token)
				.send(list)
				.end((error, res) => {
					expect(res.statusCode).to.be.equal(200)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('list updated')

					done()
				})
		})
	})

	describe('DELETE /lists/:id error token not provided', () => {
		it('should get http code 401 and object error.', (done) => {
			chai.request(app)
				.delete('/lists/111111111111111111111111')
				.end((error, res) => {
					correctErrorTokenNotProvided(res)
					done()
				})
		})
	})

	describe('DELETE /lists/:id error unauthorized', () => {
		it('should return http code error 401 and an message', (done) => {
			const title = getRandomSentence()

			const list = {
				title,
				board: '5fc811de07c54822a1096202',
			}

			chai.request(app)
				.delete('/lists/5fcf4ca31444ec0b4ea6d3b8')
				.set('token', token)
				.send(list)
				.end((error, res) => {
					expect(res.statusCode).to.be.equal(401)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('you do not belong to this board')

					done()
				})
		})
	})

	describe('DELETE /lists/:id error list not found', () => {
		it('should return http code error 500 and an message', (done) => {
			chai.request(app)
				.delete('/lists/111111111111111111111111')
				.set('token', token)
				.send({})
				.end((error, res) => {
					expect(res.statusCode).to.be.equal(500)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('no list found with id 111111111111111111111111')

					done()
				})
		})
	})

	describe('DELETE /lists/:id okey', () => {
		it('should return http code 200 and message', (done) => {
			const title = getRandomSentence()

			const list = {
				title,
				board: '5fc811770d953d222c2aef92',
			}

			chai.request(app)
				.post('/lists')
				.set('token', token)
				.send(list)
				.end((error, res) => {
					expect(res.statusCode).to.equal(201)
					res.body.should.have.property('list')
					validList(res.body.list)

					const listId = res.body.list._id

					chai.request(app)
						.delete(`/lists/${listId}`)
						.set('token', token)
						.end((error, res) => {
							expect(res.statusCode).to.be.equal(200)
							res.body.should.have.property('message')
							expect(res.body.message).to.equal('list deleted')

							done()
						})
				})
		})
	})
})

function validList(list, expectedList) {
	list.should.be.a('object')
	expect(list).to.include.all.keys('_id', 'title', 'board', 'color', 'dateAdded', 'dateUpdated')

	expect(list._id).to.be.a('string')
	expect(list.title).to.be.a('string')
	expect(list.board).to.be.a('string')
	expect(list.color).to.be.a('string')
	expect(list.dateAdded).to.be.a('string')
	expect(list.dateUpdated).to.be.a('string')

	if (expectedList) {
		expect(list.title).to.equal(expectedList.title)
		expect(list.color).to.equal(expectedList.color)
	}
}
