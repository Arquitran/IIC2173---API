const config = require('../config');
const Transactions = require('./transactions');
const APPLICATION_TOKEN = "6d876925-a71d-4379-93aa-6144138dc8fc";
const GROUP = "G2";
const TRANSACTIONS_URL = 'http://arqss16.ing.puc.cl/transactions/';

var request=require('request-promise');
var Promise = require('promise');

exports.processCart = function(req, res, next) {
  var responses = [];
  var total = req.body.length;
  var count = 0;
  for(i in req.body) {
    console.log("se" + req.body[i].product_id);
    //responses[req.body[i].product_id] = Transactions.buyProduct(req.body[i].product_id,req.body[i].amount, req.user._id);
    var jsonRequest = {
      "application_token": APPLICATION_TOKEN,
      "product": req.body[i].product_id,
      "id": GROUP,
      "amount": req.body[i].amount,
      "user_id": req.user._id
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
      responses.push({key: optionsRequest.json['product'], value: resp});
      count++;
      console.log(resp + count + total );
      if (total == count ) {
        res.send({transactions: responses});
      }
    })
    .catch(function(err){
      console.log(err);
      responses.push({key: optionsRequest.json['product'], value: err});
      count++;
      if (total == count ) {
        res.send({transactions: responses});
      }
    })

  }

}
