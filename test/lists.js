const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const expect = chai.expect

chai.should()
chai.use(chaiHttp)

describe('☕️ lists', () => {
	describe('POST /lists error required fields', () => {
		it('should return http code error 500 and an list of required fields to create a list', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((error, res) => {
					const token = res.body.token

					chai.request(app)
						.post('/lists')
						.set('token', token)
						.send({})
						.end((error, res) => {
							expect(res.statusCode).to.be.equal(500)
							res.body.should.have.property('errors')
							expect(res.body.errors).to.include.all.keys('title', 'board')

							done()
						})
				})
		})
	})

	describe('POST /lists error unauthorized', () => {
		it('should return http code error 401 and an message', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((error, res) => {
					const token = res.body.token
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
	})

	describe('POST /lists error board not found', () => {
		it('should return http code error 500 and an message', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((error, res) => {
					const token = res.body.token
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
	})

	describe('POST /lists okey', () => {
		it('should return http code 201 and list created', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'alberto@test.es', password: 'qwerty' })
				.end((error, res) => {
					const token = res.body.token
					const list = {
						title: 'TO DO',
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
	})
})

function validList(list) {
	list.should.be.a('object')
	expect(list).to.include.all.keys('_id', 'title', 'board', 'color', 'dateAdded', 'dateUpdated')

	expect(list._id).to.be.a('string')
	expect(list.title).to.be.a('string')
	expect(list.board).to.be.a('string')
	expect(list.color).to.be.a('string')
	expect(list.dateAdded).to.be.a('string')
	expect(list.dateUpdated).to.be.a('string')
}
