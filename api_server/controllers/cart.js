const config = require('../config');
const Transactions = require('./transactions');
const APPLICATION_TOKEN = "6d876925-a71d-4379-93aa-6144138dc8fc";
const GROUP = "G2";
const TRANSACTIONS_URL = 'http://arqss5.ing.puc.cl/transactions/';
const Transaction = require('../models/transaction');


var request=require('request-promise');

exports.processCart = function(req, res, next) {
  var responses = [];
  var requests = [];
  var id = 0;
  var total = req.body.length;
  var count = -1;
  for(let i = 0; i < req.body.length; i++) {
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
    requests.push(request(optionsRequest)
    .then (function(resp){
      count++;
      console.log(resp + count + total );
      const newTransaction = new Transaction({
            product: Number(req.body[i].product_id),
            amount: Number(req.body[i].amount),
            userId: Number(req.user._id),
          });
          newTransaction.save(function(err) {
            created = true;
            console.log("CREATED");
          })
      return({key: count, value: resp});

    })
    .catch(function(err){
      console.log(err);
      return({key:count, value: err});
    }));

  }



  Promise.all(requests).then((values) =>{
    var results = {};
    for (i = 0; i < values.length; i++) {
      if (values[i]["value"]["status"]["transaction_status_code"]=="EXEC"){
        results[req.body[values[i]["key"]].product_id] = 1;
      } else {
        results[req.body[values[i]["key"]].product_id] = 0;
      }
    }
    res.send(results);
  })

};
