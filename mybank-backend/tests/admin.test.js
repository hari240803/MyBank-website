const supertest = require('supertest');
const chai = require('chai');
const {app} = require('../app');

const expect = chai.expect;
const request = supertest(app);

describe('Admin Routes', function() {
    describe('GET /admin/getTransactions', function() {
        it('should get all transactions', function(done) {
            request.get('/admin/getTransactions')
                .set('adminToken', 'valid_token') // replace 'valid_token' with a valid token
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });

    describe('GET /admin/getCustomerList', function() {
        it('should get list of customers', function(done) {
            request.get('/admin/getCustomerList')
                .set('adminToken', 'valid_token') // replace 'valid_token' with a valid token
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });

    describe('GET /admin/getLogs', function() {
        it('should get all activity logs', function(done) {
            request.get('/admin/getLogs')
                .set('adminToken', 'valid_token') // replace 'valid_token' with a valid token
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });
    });

    describe('GET /admin/viewLoan', function() {
        it('should view accepted loan requests', function(done) {
            request.get('/admin/viewLoan')
                .set('adminToken', 'valid_token') // replace 'valid_token' with a valid token
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.have.property('body');
                    done();
                });
        });
    });
});