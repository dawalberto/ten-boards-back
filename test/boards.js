const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const expect = chai.expect

chai.should()
chai.use(chaiHttp)

describe('☕️ boards', () => {
	describe('/get okey', () => {
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

	describe('/post okey', () => {
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
})

function validBoard(board) {
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
