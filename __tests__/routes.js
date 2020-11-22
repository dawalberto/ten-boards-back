const request = require('supertest')
const app = require('../server/server')

describe('Users', () => {
	describe('get', () => {
		it('should return total users and users array', async () => {
			const response = await request(app).get('/users')

			expect(response.statusCode).toEqual(200)
			expect(response.body).toHaveProperty('total')
			expect(isNaN(response.body.total)).toBe(false)
			expect(response.body).toHaveProperty('users')
			expect(Array.isArray(response.body.users)).toBe(true)
		})
	})
})
