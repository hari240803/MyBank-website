const supertest = require('supertest');
const chai = require('chai');
const {app} = require('../app');

const expect = chai.expect;
const request = supertest(app);

describe('Staff Routes', function() {
    describe('POST /staff/login', function() {
        it('should login the staff', function(done) {
            request.post('/staff/login')
                .send({ id: 'staff_id', password: 'password' }) // replace with actual staff id and password
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });

    describe('GET /staff/getName', function() {
        it('should get the staff name', function(done) {
            request.get('/staff/getName')
                .set('id', 'staff_id') // replace with actual staff id
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });

    describe('POST /staff/acceptLoan', function() {
        it('should accept a loan request', function(done) {
            request.post('/staff/acceptLoan')
                .send({ id: 'staff_id', loanId: 'loan_id' }) // replace with actual staff id and loan id
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.false;
                    done();
                });
        });
    });

    describe('POST /staff/rejectLoan', function() {
        it('should reject a loan request', function(done) {
            request.post('/staff/rejectLoan')
                .send({ id: 'staff_id', loanId: 'loan_id' }) // replace with actual staff id and loan id
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.false;
                    done();
                });
        });
    });
});