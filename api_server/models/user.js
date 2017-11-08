const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var autoIncrement = require('mongoose-auto-increment');
//var connection = mongoose.createConnection("mongodb://localhost/myDatabase");
const HOST = process.env.MONGO_HOST || '127.0.0.1'
var connection = mongoose.createConnection(`mongodb://${HOST}/myDatabase`);

autoIncrement.initialize(connection);

var userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

userSchema.plugin(autoIncrement.plugin, 'User');
var User = connection.model('User', userSchema)

userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
}

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;
