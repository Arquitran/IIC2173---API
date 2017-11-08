const config = require('../config');
const Transactions = require('./transactions');
const APPLICATION_TOKEN = "6d876925-a71d-4379-93aa-6144138dc8fc";
const GROUP = "G2";
const TRANSACTIONS_URL = 'http://arqss16.ing.puc.cl/transactions/';

var request=require('request-promise');

exports.processCart = function(req, res, next) {
  var responses = [];
  var requests = [];
  var results = {};

  var id = 0;
  var total = req.body.length;
  var count = -1;
  for(i = 0; i < req.body.length; i++) {
    if (!Transactions.canBuyProduct(req.body[i].product_id,req.body[i].amount, req.user._id)){
      responses[req.body[i].product_id] = 0;
    } else {
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
        return({key: count, value: resp});
        console.log(resp + count + total );
      })
      .catch(function(err){
        console.log(err);
        return({key:count, value: err});
      }));

    }
  }

  Promise.all(requests).then((values) =>{
    for (i = 0; i < values.length; i++) {
        if (responses[req.body[i].product_id] !=0) {
          if (values[i]["value"]["status"]["transaction_status_code"]=="EXEC"){
            results[req.body[values[i]["key"]].product_id] = 1;
          } else {
            results[req.body[values[i]["key"]].product_id] = 0;
          }
        }
      }

  })


  for (i = 0; i < req.body.length; i++) {
    if (responses[req.body[i].product_id] ==0){
      results[req.body[i].product_id] = 0;
    }
  }

    res.send(results);

};
