const nameGenerator = require('project-name-generator')
const chai = require('chai')
const expect = chai.expect
chai.should()

function correctErrorTokenNotProvided(reponse) {
	expect(reponse.statusCode).to.equal(401)
	reponse.body.should.have.property('error')
	reponse.body.error.should.have.property('name')
	reponse.body.error.should.have.property('message')
	expect(reponse.body.error.name).to.equal('JsonWebTokenError')
	expect(reponse.body.error.message).to.equal('jwt must be provided')
}

function getRandomSentence(numWords = 3) {
	return nameGenerator({ words: numWords }).spaced
}

module.exports = { correctErrorTokenNotProvided, getRandomSentence }
