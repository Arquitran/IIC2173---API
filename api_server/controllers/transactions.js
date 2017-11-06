const Transaction = require('../models/transaction');
const config = require('../config');
var request=require('request-promise');

const MAX_PURCHASES_PER_DAY = 3;
const APPLICATION_TOKEN = "6d876925-a71d-4379-93aa-6144138dc8fc";
const GROUP = "G2";
const TRANSACTIONS_URL = 'http://arqss16.ing.puc.cl/transactions/';


exports.buyProduct = function(productId, amount, userId) {
  const yesterday = new Date(Date.now() - 864e5);
  //const userId = req.body.user_id;

  console.log(userId);

  Transaction.count({ userId, productId })
    .where('createdAt')
    .gt(yesterday)
    .exec(function (err, count) {
      if (err) {
        return next(err)
      }
      if (count + amount > MAX_PURCHASES_PER_DAY) {
        return res.status(401).send({ error: 'Exceeds daily purchase limit'})
      } else {

        var jsonRequest = {
          "application_token": APPLICATION_TOKEN,
          "product": productId,
          "id": GROUP,
          "amount": amount,
          "user_id": userId
        };
        var optionsRequest = {
             url: TRANSACTIONS_URL,
             method: 'POST',
             headers: {
               'Content-Type': 'application/json'
             },
             json: jsonRequest
        };
        request(optionsRequest)
        .then (function(resp){
          console.log(resp );
          return "Success"

        })
        .catch(function(err){
          console.log(err);
          return "Error"
        })
      }
    });
}
