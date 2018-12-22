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
      // Clear User model
      Cache.deleteMany({}, function (err) {
        if (err) {
          console.error('Error in clearing Cache collection before the tests.', err);
        }
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
    // --- Clear all Collections --- //
    Cache.deleteMany({}, function (err) {
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

  // --- GET /cache ----------------------------------------------------------------- //
  describe('GET /cache', function () {
    it('it should return all the keys stored in the cache', function (done) {
      chai.request(server)
        .get('/api/v1/cache')
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.should.have.status(200);
            // Since we created 1 record in the previous test;
            res.body.should.be.a('array').that.has.lengthOf(1);
            done();
          }
        });
    });
  });

  // --- GET /cache/:key ----------------------------------------------------------------- //
  describe('GET /cache/:key', function () {
    it('it should return the cached data for a given key', function (done) {
      chai.request(server)
        .get('/api/v1/cache/someRandomKey')
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.should.have.status(201);
            res.body.should.be.a('string');
            done();
          }
        });
    });
    it('it should verify that a new record was created as the previous given key was not found', function (done) {
      chai.request(server)
        .get('/api/v1/cache')
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.should.have.status(200);
            // Since we created 1 more record in the previous test;
            res.body.should.be.a('array').that.has.lengthOf(2);
            done();
          }
        });
    });
  });

  // --- DELETE /cache/:key ----------------------------------------------------------------- //
  describe('DELETE /cache/:key', function () {
    it('it should remove a given key from the cache', function (done) {
      chai.request(server)
        .delete('/api/v1/cache/someRandomKey')
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            done();
          }
        });
    });
    it('it should verify that the key was deleted', function (done) {
      chai.request(server)
        .get('/api/v1/cache')
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.should.have.status(200);
            // Since we deleted 1 record in the previous test.
            res.body.should.be.a('array').that.has.lengthOf(1);
            done();
          }
        });
    });
  });

  // --- DELETE /cache ----------------------------------------------------------------- //
  describe('DELETE /cache', function () {
    it('it should remove all keys from the cache', function (done) {
      chai.request(server)
        .delete('/api/v1/cache')
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            done();
          }
        });
    });
    it('it should verify that all the keys were deleted', function (done) {
      chai.request(server)
        .get('/api/v1/cache')
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.should.have.status(200);
            // Since we deleted all keys in the previous test
            res.body.should.be.a('array').that.has.lengthOf(0);
            done();
          }
        });
    });
  });
});
