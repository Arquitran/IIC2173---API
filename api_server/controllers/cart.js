const config = require('../config');
const Transactions = require('./transactions');
const APPLICATION_TOKEN = "6d876925-a71d-4379-93aa-6144138dc8fc";
const GROUP = "G2";
const TRANSACTIONS_URL = 'http://arqss16.ing.puc.cl/transactions/';
const Transaction = require('../models/transaction');
const MAX_PURCHASES_PER_DAY = 3;


var request = require('request-promise');

exports.processCart = function(req, res, next) {
  var responses = [req.body.length];
  var requests = [];
  var results = {};
  var id = 0;
  var total = req.body.length;
  var count = -1;
  for (i = 0; i < req.body.length; i++) {
    var canBUy = new Promise(function(resolve, reject) {
      const yesterday = new Date(Date.now() - 864e5);
      //const userId = req.body.user_id;
      var created = false;
      Transaction.find({
        userId: req.user._id,
        product: req.body[i].product_id,
        createdAt: {
          $gte: yesterday
        },
      }).exec((err, docs) => {
        if (err) {
          resolve(false);
        }
        var count = docs.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );

        console.log(`FIND ${count} PRODUCT ${req.body[i].product_id}`);

        if (count > MAX_PURCHASES_PER_DAY) {
          console.log("NOT CREATED");
          created = false;
          resolve(false);

        } else {
          const newTransaction = new Transaction({
            product: Number(req.body[i].product_id),
            amount: Number(req.body[i].amount),
            userId: Number(req.user._id),
          });
          newTransaction.save(function(err) {
            created = true;
            console.log("CREATED");
            resolve(true);
          })
        }
      });

      console.log(`created ${created}`);
    })

    canBUy.then(result => {
        if (result == false) {
          console.log("0");
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
            .then(function(resp) {
              count++;
              console.log(resp + count + total);
              return ({
                key: count,
                value: resp
              });
            })
            .catch(function(err) {
              console.log(err);
              return ({
                key: count,
                value: err
              });
            }
          )
          );
        }
      })
      .catch(error => {
        console.log(`error ${error}`);
      })
  }

  Promise.all(requests).then((values) => {
    for (i = 0; i < values.length; i++) {
      if (responses[req.body[i].product_id] != 0) {
        if (values[i]["value"]["status"]["transaction_status_code"] == "EXEC") {
          results[req.body[values[i]["key"]].product_id] = 1;
        } else {
          results[req.body[values[i]["key"]].product_id] = 0;
        }
      }
    }
  })

  for (i = 0; i < req.body.length; i++) {
    console.log("for");

    if (responses[req.body[i].product_id] == 0 || responses[req.body[i].product_id] == undefined) {
      results[req.body[i].product_id] = 0;
    }
  }
  res.send(results);

};
