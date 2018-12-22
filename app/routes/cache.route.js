/**
 * POST     /cache          - creates/updates the data for a given key
 * GET      /cache          - returns all stored keys in the cache
 * DELETE   /cache          - removes all keys from the cache
 * GET      /cache/:key     - returns the cached data for a given key
 * DELETE   /cache/:key     - removes a given key from the cache
 */
const cacheServices = require('./../services/cache.services')();

module.exports = function initiateCacheRoutes(router) {
  // --------------------------------------------------------------------------------------------
  // on routes that end in /cache
  // --------------------------------------------------------------------------------------------
  router.route('/cache')
    /**
     * @desc returns all stored keys in the cache
     * @example GET http://host:port/api/v1/cache
     */
    .get((req, res) => {
      cacheServices.fetchAllKeys().then((keys) => {
        res.status(200).json(keys);
      }, (err) => {
        res.status(400).json(err);
      });
    })
    /**
     * @desc creates/updates the data for a given key
     * @example POST http://host:port/api/v1/cache
     */
    .post((req, res) => {
      cacheServices.createOrUpdate(req.body).then((doc) => {
        res.status(200).json(doc);
      }, (err) => {
        res.status(400).json(err);
      });
    })
    /**
     * @desc removes all keys from the cache
     * @example DELETE http://host:port/api/v1/cache
     */
    .delete((req, res) => {
      cacheServices.remove().then((data) => {
        res.status(200).json(data);
      }, (err) => {
        res.status(400).json(err);
      });
    });
  // --------------------------------------------------------------------------------------------
  // on routes that end in /cache/:key
  // --------------------------------------------------------------------------------------------
  router.route('/cache/:key')
    /**
     * @desc returns the cached data for a given key
     * @example GET http://localhost:8080/api/v1/cache/someRandomKey
     */
    .get((req, res) => {
      cacheServices.read(req.params.key).then((record) => {
        res.status(record.statusCode).json(record.data);
      }, (err) => {
        res.status(400).json(err);
      });
    })
    /**
     * @desc removes a given key from the cache
     * @example DELETE http://localhost:8080/api/v1/cache/someRandomKey)
     */
    .delete((req, res) => {
      cacheServices.remove(req.params.key).then((data) => {
        res.status(200).json(data);
      }, (err) => {
        res.status(400).json(err);
      });
    });
};
