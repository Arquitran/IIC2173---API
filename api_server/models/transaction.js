const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const transactionSchema = new Schema({
  product: Number,
  amount: Number,
  userId: Number,
},
{
  timestamps: true,
});

const ModelClass = mongoose.model('transaction', transactionSchema);

module.exports = ModelClass;
