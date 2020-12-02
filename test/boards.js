const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const expect = chai.expect

chai.should()
chai.use(chaiHttp)

describe('☕️ boards', () => {
	describe('/get okey', () => {
		it('It should get the total number of boards and an array of boards the logged user belongs to.', () => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@alberto.es', password: 'qwerty' })
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

							done()
						})
					done()
				})
		})
	})

	describe('/post okey', () => {
		it('should create board and return http code 201', () => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@alberto.es', password: 'qwerty' })
				.end((err, res) => {
					const token = res.body.token
					const board = {
						title: 'fake board',
						description: 'fake board for test purpose',
						totalTime: 0,
						public: false,
						finished: false,
						user: '5fc7f2378882b116e9e37236',
						dateAdded: new Date(),
						dateUpdated: new Date(),
						members: ['5fc7f2378882b116e9e37236'],
						background: '#00a8ff',
					}

					chai.request(app)
						.post('/boards')
						.set('token', token)
						.send(board)
						.end((err, res) => {
							expect(res.statusCode).to.equal(201)
							done()
						})
					done()
				})
		})
	})
})
