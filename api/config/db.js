const mongoose = require('mongoose');

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    mongoose
      .connect('mongodb://127.0.0.1:27017/StudentAsses', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        socketTimeoutMS: 30000,
        connectTimeoutMS: 30000
      })
      .then(() => {
        dbConnection = mongoose.connection;
        console.log('Connected to MongoDB');
        return cb();
      })
      .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        return cb(err);
      });
  },
  getDb: () => dbConnection
};
