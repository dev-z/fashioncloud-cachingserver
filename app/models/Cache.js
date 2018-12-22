/**
 * @author Ishtiaque
 * @desc Schema Definition for "Cache" collection
 */
const mongoose = require('mongoose');

module.exports = (function createCacheSchema() {
  // Defining the Schema
  const Schema = mongoose.Schema;
  const cacheSchema = new Schema({
    key: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    data: Schema.Types.Mixed,
    createdAt: {
      type: Date,
      expires: '5s', // Expire record after 1 hour
      default: Date.now(),
    },
  });
  /**
   * {
        capped: {
          size: 1048576, // In bytes. ~1MB
          max: 1000,
      },
    }
   * NOTE 1: The capped option enables capped collections. These are fixed-size collections
   * that support high-throughput operations that insert and retrieve documents based on
   * insertion order. Capped collections work in a way similar to circular buffers: once
   * a collection fills its allocated space, it makes room for new documents by overwriting
   * the oldest documents in the collection.
   * Please refer:
   * https://mongoosejs.com/docs/guide.html#capped
   * https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection
   *
   * NOTE2 : The strict option, (enabled by default), ensures that values passed to our model
   * constructor that were not specified in our schema do not get saved to the db.
   * Pass a 2nd param like: const cacheSchema = new Schema({..}, { strict: false });
   */
  // Adding index
  cacheSchema.index({ key: 1 });
  // Creating a Model
  const Cache = mongoose.model('Cache', cacheSchema);
  return Cache;
}());
