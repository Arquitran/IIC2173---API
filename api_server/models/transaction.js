const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const request = require('request-promise');

const MAX_AMOUNT_PER_DAY = 3;
const GROUP = "G2";
const APPLICATION_TOKEN = "6d876925-a71d-4379-93aa-6144138dc8fc";
const TRANSACTIONS_URL = 'http://arqss5.ing.puc.cl/web/transactions/';

const transactionSchema = new Schema({
  product: Number,
  amount: Number,
  userId: Number,
},
{
  timestamps: true,
});

transactionSchema.statics.processTransaction = async function(newTransaction, userId) {
  // Verificar que no se haya superado el límite de transacciones.
  const product_id = parseInt(newTransaction.product_id);
  const amount = parseInt(newTransaction.amount);
  const yesterday = new Date(Date.now() - 864e5);
  const previousTransactions = await this.find({
    product: product_id,
    createdAt: { $gte: yesterday},
    userId,
  }).then(queryResult => {
    return queryResult;
  });
  const amountBought = previousTransactions.reduce(
    (sum, transaction) => sum + transaction.amount, 0
  );
  if(amountBought + amount > MAX_AMOUNT_PER_DAY) {
    return [product_id, 0];
  }
  return [product_id, amount];
}

transactionSchema.statics.createTransaction = async function(transactionArray, userId) {
  // Insertar transacciones en base de datos.
  await new this({
    product: transactionArray[0],
    amount: transactionArray[1],
    userId: parseInt(userId),
  }).save().then(saveResponse => {
    return saveResponse;
  });
}

transactionSchema.statics.sendAPIRequests = function(transactionsArray, userId) {
  var requests = [];
  transactionsArray.forEach(function(element) {
    console.log("element", element);
    var jsonRequest = {
      "application_token": APPLICATION_TOKEN,
      "product": element[0],
      "id": GROUP,
      "amount": element[1],
      "user_id": userId,
    };
    var optionsRequest = {
         url: TRANSACTIONS_URL,
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         json: jsonRequest,
    };
    requests.push(request(optionsRequest).then(response => {
      return { httpResponse: response, params: element, };
    }));
  })
 return Promise.all(requests);
}

const ModelClass = mongoose.model('transaction', transactionSchema);

module.exports = ModelClass;
