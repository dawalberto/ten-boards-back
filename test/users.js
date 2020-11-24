const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server/server')
const expect = chai.expect
const should = chai.should()

chai.use(chaiHttp)

describe('/get', () => {
	it('should return total users and users array', async () => {
		const response = await chai.request(app).get('/users')

		expect(response.statusCode).to.equal(200)
		response.body.should.have.property('total')
		response.body.should.have.property('users')
		expect(isNaN(response.body.total)).to.equal(false)
		expect(Array.isArray(response.body.users)).to.equal(true)
	})
})
