const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const expect = chai.expect

chai.should()
chai.use(chaiHttp)

describe('☕️ boards', () => {
	describe('GET /boards okey', () => {
		it('should get the total number of boards and an array of boards in which the user participates.', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((err, res) => {
					const token = res.body.token

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
	})

	describe('GET /boards/:id okey', () => {
		it('should get the board with id passed only if user belongs to this board.', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((err, res) => {
					const token = res.body.token

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
	})

	describe('GET /boards/:id error unauthorized', () => {
		it('should get unoauthorized code 401 and message that says that.', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((err, res) => {
					const token = res.body.token

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
	})

	describe('GET /boards/:id error no boards found', () => {
		it('should get the board with id passed only if user belongs to this board.', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((err, res) => {
					const token = res.body.token

					chai.request(app)
						.get('/boards/111111111111111111111111')
						.set('token', token)
						.end((err, res) => {
							expect(res.statusCode).to.equal(400)

							done()
						})
				})
		})
	})

	describe('POST /boards okey', () => {
		it('should create board and return it', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((err, res) => {
					const token = res.body.token
					const board = {
						title: 'fake board',
						description: 'fake board for test purpose',
						totalTime: 0,
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
							res.body.board.should.be.a('object')
							validBoard(res.body.board)

							done()
						})
				})
		})
	})

	describe('DELETE /boards/:id error already finished', () => {
		it('should return http code 400', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((err, res) => {
					const token = res.body.token

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
	})

	describe('DELETE /boards/:id error unauthorized', () => {
		it('should return http code 401', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((err, res) => {
					const token = res.body.token

					chai.request(app)
						.delete('/boards/5fc811de07c54822a1096202')
						.set('token', token)
						.end((err, res) => {
							expect(res.statusCode).to.equal(401)
							res.body.should.have.property('message')
							expect(res.body.message).to.equal('only the owner can finish the board')

							done()
						})
				})
		})
	})

	describe('DELETE /boards/:id error no board found', () => {
		it('should return http code 400', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((err, res) => {
					const token = res.body.token

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
	})
})

function validBoard(board) {
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
		'dateModified'
	)
}
