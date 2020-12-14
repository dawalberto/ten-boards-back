const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const Board = require('../database/models/board')
const { correctErrorTokenNotProvided, getRandomSentence } = require('./generics')
const expect = chai.expect

chai.should()
chai.use(chaiHttp)

describe('☕️ boards', () => {
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

	describe('GET /boards error token not provided', () => {
		it('should get http code 401 and object error.', (done) => {
			chai.request(app)
				.get('/boards')
				.end((err, res) => {
					correctErrorTokenNotProvided(res)
					done()
				})
		})
	})

	describe('GET /boards okey', () => {
		it('should get the total number of boards and an array of boards in which the user participates.', (done) => {
			chai.request(app)
				.get('/boards')
				.set('token', token)
				.end((err, res) => {
					expect(res.statusCode).to.equal(200)
					res.body.should.have.property('total')
					res.body.should.have.property('boards')
					expect(isNaN(res.body.total)).to.equal(false)
					expect(Array.isArray(res.body.boards)).to.equal(true)

					if (res.body.boards.length !== 0) {
						validBoard(res.body.boards[0])
					}

					done()
				})
		})
	})

	describe('GET /boards/:id error token not provided', () => {
		it('should get http code 401 and object error.', (done) => {
			chai.request(app)
				.get('/boards/5fc811770d953d222c2aef92')
				.end((err, res) => {
					correctErrorTokenNotProvided(res)
					done()
				})
		})
	})

	describe('GET /boards/:id error unauthorized', () => {
		it('should get unoauthorized code 401 and message that says that.', (done) => {
			chai.request(app)
				.get('/boards/5fc811de07c54822a1096202')
				.set('token', token)
				.end((err, res) => {
					expect(res.statusCode).to.equal(401)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('you do not belong to this board')

					done()
				})
		})
	})

	describe('GET /boards/:id error no board found', () => {
		it('should get the board with id passed only if user belongs to this board.', (done) => {
			chai.request(app)
				.get('/boards/111111111111111111111111')
				.set('token', token)
				.end((err, res) => {
					expect(res.statusCode).to.equal(500)

					done()
				})
		})
	})

	describe('GET /boards/:id okey', () => {
		it('should get the board with id passed only if user belongs to this board.', (done) => {
			chai.request(app)
				.get('/boards/5fc811770d953d222c2aef92')
				.set('token', token)
				.end((err, res) => {
					expect(res.statusCode).to.equal(200)
					res.body.should.have.property('board')
					validBoard(res.body.board)

					done()
				})
		})
	})

	describe('POST /boards error token not provided', () => {
		it('should get http code 401 and object error.', (done) => {
			chai.request(app)
				.post('/boards')
				.end((err, res) => {
					correctErrorTokenNotProvided(res)
					done()
				})
		})
	})

	describe('POST /boards error required fields', () => {
		it('should return http code 500 and object error with required fields to create a board', (done) => {
			chai.request(app)
				.post('/boards')
				.set('token', token)
				.send({})
				.end((err, res) => {
					expect(res.statusCode).to.equal(500)
					res.body.should.have.property('errors')
					expect(res.body.errors).to.include.all.keys('title', 'description')

					done()
				})
		})
	})

	describe('POST /boards okey', () => {
		it('should create board and return it', (done) => {
			const title = getRandomSentence()
			const description = getRandomSentence(5)

			const board = {
				title,
				description,
				public: false,
				finished: false,
				background: '#00a8ff',
			}

			chai.request(app)
				.post('/boards')
				.set('token', token)
				.send(board)
				.end((err, res) => {
					expect(res.statusCode).to.equal(201)
					res.body.should.have.property('board')
					validBoard(res.body.board, board)

					done()
				})
		})
	})

	describe('DELETE /boards/:id error token not provided', () => {
		it('should get http code 401 and object error.', (done) => {
			chai.request(app)
				.delete('/boards/111111111111111111111111')
				.end((err, res) => {
					correctErrorTokenNotProvided(res)
					done()
				})
		})
	})

	describe('DELETE /boards/:id error already finished', () => {
		it('should return http code 400', (done) => {
			chai.request(app)
				.delete('/boards/5fc811770d953d222c2aef92')
				.set('token', token)
				.end((err, res) => {
					expect(res.statusCode).to.equal(400)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('board already finished')

					done()
				})
		})
	})

	describe('DELETE /boards/:id error unauthorized', () => {
		it('should return http code 401', (done) => {
			chai.request(app)
				.delete('/boards/5fc811de07c54822a1096202')
				.set('token', token)
				.end((err, res) => {
					expect(res.statusCode).to.equal(401)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('only the owner has permission for this')

					done()
				})
		})
	})

	describe('DELETE /boards/:id error no board found', () => {
		it('should return http code 400', (done) => {
			chai.request(app)
				.delete('/boards/111111111111111111111111')
				.set('token', token)
				.end((err, res) => {
					expect(res.statusCode).to.equal(400)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('no board found with id 111111111111111111111111')

					done()
				})
		})
	})

	describe('DELETE /boards/:id okey', () => {
		before((done) => {
			Board.updateMany({}, { finished: false }, (error, updated) => {
				if (error || !updated) {
					done(error)
				}

				done()
			})
		})

		it('should finish board and return http code 200', (done) => {
			chai.request(app)
				.delete('/boards/5fc811770d953d222c2aef92')
				.set('token', token)
				.end((err, res) => {
					expect(res.statusCode).to.equal(200)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('board finished')

					done()
				})
		})
	})

	describe('PUT /boards/:id error token not provided', () => {
		it('should get http code 401 and object error.', (done) => {
			chai.request(app)
				.put('/boards/111111111111111111111111')
				.end((err, res) => {
					correctErrorTokenNotProvided(res)
					done()
				})
		})
	})

	describe('PUT /boards/:id error unauthorized', () => {
		it('should return http code 401', (done) => {
			chai.request(app)
				.put('/boards/5fc811de07c54822a1096202')
				.set('token', token)
				.end((err, res) => {
					expect(res.statusCode).to.equal(401)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('only the owner has permission for this')

					done()
				})
		})
	})

	describe('PUT /boards/:id error no board found', () => {
		it('should return http code 400', (done) => {
			chai.request(app)
				.put('/boards/111111111111111111111111')
				.set('token', token)
				.end((err, res) => {
					expect(res.statusCode).to.equal(400)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('no board found with id 111111111111111111111111')

					done()
				})
		})
	})

	describe('PUT /boards/:id okey', () => {
		it('should return http code 200 and an message', (done) => {
			const title = getRandomSentence()
			const description = getRandomSentence(5)

			const board = {
				title,
				description,
				public: true,
				members: ['5fc7f2388882b116e9e37238', '5fc7f23a8882b116e9e37239', '111111111111111111111111'],
				background: '#4bcffa',
			}

			chai.request(app)
				.put('/boards/5fc811770d953d222c2aef92')
				.set('token', token)
				.send(board)
				.end((err, res) => {
					expect(res.statusCode).to.equal(200)
					res.body.should.have.property('message')
					expect(res.body.message).to.equal('board updated')

					done()
				})
		})
	})
})

function validBoard(board, expectedBoard) {
	board.should.be.a('object')
	expect(board).to.include.all.keys(
		'totalTime',
		'public',
		'finished',
		'members',
		'_id',
		'title',
		'description',
		'user',
		'dateAdded',
		'background',
		'dateUpdated'
	)

	expect(board.totalTime).to.be.a('number')
	expect(board.totalTime).to.equal(0)
	expect(board.public).to.be.a('boolean')
	expect(board.finished).to.be.a('boolean')
	expect(board.members).to.be.a('array')
	expect(board._id).to.be.a('string')
	expect(board.title).to.be.a('string')
	expect(board.description).to.be.a('string')
	expect(board.user).to.be.a('string')
	expect(board.dateAdded).to.be.a('string')
	expect(board.background).to.be.a('string')
	expect(board.dateUpdated).to.be.a('string')

	if (expectedBoard) {
		expect(board.title).to.equal(expectedBoard.title)
		expect(board.description).to.equal(expectedBoard.description)
		expect(board.public).to.equal(expectedBoard.public)
		expect(board.finished).to.equal(expectedBoard.finished)
		expect(board.background).to.equal(expectedBoard.background)
	}
}
