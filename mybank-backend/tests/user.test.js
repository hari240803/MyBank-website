const supertest = require('supertest');
const chai = require('chai');
const {app} = require('../app');

const expect = chai.expect;
const request = supertest(app);

describe('User Routes', function() {
    // Existing test
    describe('POST /trackLogin', function() {
        it('should track login', function(done) {
            request.post('/user/trackLogin')
                .send({ accountNumber: '123456' })
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });

    // New tests
    describe('GET /getName', function() {
        it('should get the user name', function(done) {
            request.get('/user/getName')
                .set('userToken', 'valid_token')
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(404);
                    done();
                });
        });
    });

    describe('POST /login', function() {
        it('should login the user', function(done) {
            request.post('/user/login')
                .send({ accountNumber: '6444fd724a0b2694e883edf8', password: 'NewAccount!123' })
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });

    describe('POST /register', function() {
        it('should register a new user', function(done) {
            request.post('/user/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phoneNumber: '1234567890',
                    fileUrl: 'http://example.com/file.pdf'
                })
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.a('string');
                    done();
                });
        });
    });

    describe('POST /transfer', function() {
        it('should transfer funds', function(done) {
            request.post('/user/transfer')
                .send({
                    userToken: 'valid_token',
                    recipientAccountNumber: 'recipient_account_number',
                    amount: 100
                })
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.have.property('message');
                    done();
                });
        });
    });
});