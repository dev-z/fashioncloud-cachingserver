const Cache = require('../models/Cache');
const createRandomString = require('../utils/stringGenerator');

module.exports = function cacheService() {
  /**
   * @author Ishtiaque
   * @desc creates/updates the data for a given key
   * @param {Object} document Cache document.
   * @returns {Promise} Returns a Promise.
   * Resolves to Cache on success, Object on failure.
   */
  function createOrUpdate(document) {
    const promise = new Promise((resolve, reject) => {
      const conditions = {
        key: document.key,
      };
      const updateData = {
        data: document.data,
        createdAt: Date.now(),
      };
      const options = {
        // Return the document after updates are applied
        new: true,
        // Create a document if one isn't found
        upsert: true,
        setDefaultsOnInsert: true,
      };
      Cache.findOneAndUpdate(conditions, updateData, options, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc.data);
        }
      });
    });
    return promise;
  }

  /**
   * @author Ishtiaque
   * @desc returns all stored keys in the cache
   * @returns {Promise.<Array|Error} [keys] on success, Error object on failure.
   */
  function fetchAllKeys() {
    const promise = new Promise((resolve, reject) => {
      const conditions = {};
      const projection = 'key';
      Cache.find(conditions, projection, (err, res) => {
        if (err) {
          reject(err);
        } else {
          const keys = res.map(each => each.key);
          resolve(keys);
        }
      });
    });
    return promise;
  }

  /**
   * @author Ishtiaque
   * @desc returns the cached data for a given key
   * @param {String} key the key of which the data is to be fetched
   * @returns {Promise.<data|Object>} cached data on success, Error object on failure.
   */
  function read(key) {
    const promise = new Promise((resolve, reject) => {
      const conditions = { key };
      Cache.findOne(conditions, (findErr, record) => {
        if (findErr) {
          reject(findErr);
        } else if (record) {
          console.info('Cache hit');
          resolve({
            statusCode: 200,
            data: record.data,
          });
        } else {
          console.info('Cache miss');
          // In case of cache miss, create a random string,
          // Update the cache with this random string and return the random string
          const recordToCreate = {
            key,
            data: createRandomString(),
          };
          Cache.create(recordToCreate).then((createdRecord) => {
            resolve({
              statusCode: 201,
              data: createdRecord.data,
            });
          }).catch((createErr) => {
            reject(createErr);
          });
        }
      });
    });
    return promise;
  }

  /**
   * @author Ishtiaque
   * @desc Removes all keys from the cache OR removes a given key from the cache.
   * Removes all keys if no key is provided.
   * @param {String} key [OPTIONAL] Key of the cached data to be deleted permanently.
   * @returns {Promise.<Object|Object>}
   */
  function remove(key) {
    const promise = new Promise((resolve, reject) => {
      // Empty condition to remove all documents
      let conditions = {};
      if (key) {
        conditions = { key };
      }
      Cache.deleteMany(conditions, (err) => {
        if (err) {
          reject(err);
        } else {
          const message = key ? `Key ${key} was removed` : 'All keys were removed';
          resolve({ message });
        }
      });
    });
    return promise;
  }

  return {
    createOrUpdate,
    fetchAllKeys,
    read,
    remove,
  };
};
