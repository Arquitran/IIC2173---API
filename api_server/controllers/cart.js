const config = require('../config');
const Transactions = require('./transactions');
const APPLICATION_TOKEN = "6d876925-a71d-4379-93aa-6144138dc8fc";
const GROUP = "G2";
const TRANSACTIONS_URL = 'https://arqss5.ing.puc.cl/transactions/';
const Transaction = require('../models/transaction');


var request=require('request-promise');

exports.processUser = async function(req, res, next) {
  console.log("userCart")

}

exports.processCart = async function(req, res, next) {
  // Process body.
  const transactionsArrayPromises = req.body.map(bodyTransaction => {
    return Transaction.processTransaction(bodyTransaction, req.user._id);
  });

  Promise.all(transactionsArrayPromises).then(transactionsArray => {

    const transactions = [];
    const dbPromises = [];
    // Send API requests.
    console.log("transactionsArray", transactionsArray);
    Transaction.sendAPIRequests(transactionsArray, req.user._id).then(responses => {
      responses.forEach(response => {
        console.log("sendAPIRequests", response);
        if(response.httpResponse.status.transaction_status_code === "EXEC") {
          dbPromises.push(Transaction.createTransaction(response.params, req.user._id).then(dbResponse => {
            return [dbResponse, response.params];
          }));
        }
      });

      Promise.all(dbPromises).then(dbValues => {
        const responseArray = []
        dbValues.map(dbValue => dbValue[1]).forEach(function(element) {
          var json = {};
          json[element[0]] = element[1];
          responseArray.push(json);
        });
        return res.json(responseArray);
      });
    }).catch(error => {
      console.log(error);
      return res.sendStatus(500);
    });

  })
};
