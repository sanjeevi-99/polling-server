const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*
function dotify(obj: object) {
  const res = {};
  function recurse(obj: object, current?: string) {
    for (const key in obj) {
      const value = obj[key];
      const newKey = (current ? current + '.' + key : key);
      if (value && typeof value === 'object') {
        recurse(value, newKey);
      } else {
        res[newKey] = value;
      }
    }
  }
  recurse(obj);
  return res;
}
*/
var notEmpty = function (data) {
  if (data.length <= 1) {
    return false
  } else {
    return true;
  }
}

const userModel = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('users', userModel);
