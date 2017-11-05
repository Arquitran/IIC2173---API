const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const transactionSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
  application_token: String,
  product: Number,
  id: Number,
  amount: String,
  user_id:Number

});

userSchema.methods.checkMaxTransaction = function( callback) {
}

const ModelClass = mongoose.model('transaction', transactionSchema);

module.exports = ModelClass;
