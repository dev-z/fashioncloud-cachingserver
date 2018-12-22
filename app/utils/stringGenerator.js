/**
 * Creates a random string and returns it
 * @author Ishtiaque
 * @param {Integer} length [OPTIONAL] [DEFAULT 8] Length of the string
 * @returns {String}
 */
module.exports = function createRandomString(length = 8) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  let randomString = '';

  // Loop for creating random string
  for (let i = 0; i < length; i += 1) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(rnum, rnum + 1);
  }

  return randomString;
};
