
const mongoose = require('mongoose');

module.exports = (function () {

  const  MONGO_URI  = process.env.MONGODB_URI;
  
  mongoose
      .connect(MONGO_URI, {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true
      })
      .then(() => console.log(`MongoDB ${MONGO_URI} Connected`))
      .catch((err) => console.error(err));
})();


