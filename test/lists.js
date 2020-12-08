const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const expect = chai.expect

chai.should()
chai.use(chaiHttp)

describe('☕️ lists', () => {
	describe('POST /lists error', () => {
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
})
