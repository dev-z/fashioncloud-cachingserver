/* eslint-disable prefer-arrow-callback, func-names, comma-dangle,
 no-unused-expressions, no-unused-vars */
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const Cache = require('./../app/models/Cache');

const should = chai.should();

chai.use(chaiHttp);

describe('Cache Tests', function () {
  // --- HOOKS ----------------------------------------------------------------------- //
  // runs before all tests in this block
  before(function (done) {
    // A little delay so the DB connection is established and startServer() is called.
    setTimeout(function () {
      // Create global variable for storing some temp data.
      global.tests = {};
      // Clear User model
      Cache.remove({}, function (err) {
        if (err) {
          console.error('Error in clearing Cache collection before the tests.', err);
        }
        console.info('Cache cleared');
      });
      done();
    }, 5000);
  });
  // Before each test
  /* beforeEach(function (done) {

      done();
  }); */

  // runs after all tests in this block
  after(function (done) {
    // --- Clear global variables --- //
    global.tests = undefined;
    // --- Clear all Collections --- //
    Cache.remove({}, function (err) {
      if (err) {
        console.error('Error in clearing Cache collection after tests.', err);
      }
    });
    done();
  });

  // --- TESTS ----------------------------------------------------------------------- //
  // --- POST /cache ----------------------------------------------------------------- //
  describe('POST /cache', function () {
    it('it should create ONE record.', function (done) {
      chai.request(server)
        .post('/api/v1/cache')
        .send({
          key: 'testkey1',
          data: 'TEST_DATA_1'
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.should.have.status(200);
            res.body.should.be.a('string');
            res.body.should.be.equal('TEST_DATA_1');
            // Store these details for later tests.
            global.tests.record1 = {
              key: 'testkey1',
              data: 'TEST_DATA_1'
            };
            done();
          }
        });
    });

    it('it should reject incorrect data format.', function (done) {
      chai.request(server)
        .post('/api/v1/cache')
        .send({
          document: {
            key: 'KeyX',
            data: 'sdfjsdf'
          }
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error')
            .that.is.equal('ValidationError');
          done();
        });
    });

    it('it should reject empty body.', function (done) {
      chai.request(server)
        .post('/api/v1/cache')
        .send({})
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error')
            .that.is.equal('ValidationError');
          done();
        });
    });

    it('it should reject data with missing key.', function (done) {
      chai.request(server)
        .post('/api/v1/cache')
        .send({
          data: 'abcd123'
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error')
            .that.is.equal('ValidationError');
          done();
        });
    });

    it('it should reject data with missing data.', function (done) {
      chai.request(server)
        .post('/api/v1/cache')
        .send({
          key: 'failkey'
        })
        .end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error')
            .that.is.equal('ValidationError');
          done();
        });
    });
  });
});
