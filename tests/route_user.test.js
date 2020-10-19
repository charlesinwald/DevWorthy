const should = require('should');
const assert = require('assert');
const request = require('supertest');
const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../server');

// Configure chai
chai.use(chaiHttp);
var expect = chai.expect;


describe( 'User Registration', () => {
    it('Should return 201 and confirmation for valid input', done => {
        const sampleUser = {
            firstName : 'Mario',
            lastName: 'Rossi',
            email: 'mario.rossi@gmail.com',
            password: 'supermario'
        };

        //Send request to the app
        request(app)
            .post('/api/users')
            .send(sampleUser)
            .then((res) => {
                //asserion
                expect(res).to.have.status(201);
                expect(res.body.message).to.be.equal("User created!");
                expect(res.body.errors.length).to.be.equal(0);
                done()
            }).catch( err => {
            console.log(err.message)
        })
    })
});