const User = require('../models/user');
const Transaction = require('../models/transaction');
const SECRET = "tremendosecreto";


exports.processCart =  function (options){
  return function(req, res, next) {
    console.log(new Date(), req.method, req.url, req.headers.authorization);
    if (req.headers.authorization == SECRET){
      User.findOne(
         { email: req.headers.email }
       ).then(user => {
        console.log(user);

        const transactionsArrayPromises = req.body.map(bodyTransaction => {
          return Transaction.processTransaction(bodyTransaction, user._id);
        });

        Promise.all(transactionsArrayPromises).then(transactionsArray => {
          const transactions = [];
          const dbPromises = [];
          // Send API requests.
          console.log("transactionsArray", transactionsArray);
          Transaction.sendAPIRequests(transactionsArray, user._id).then(responses => {
            responses.forEach(response => {
              console.log("sendAPIRequests", response);
              if(response.httpResponse.status.transaction_status_code === "EXEC") {
                dbPromises.push(Transaction.createTransaction(response.params, user._id).then(dbResponse => {
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

      }).catch(err => {
        res.send(403)
      })
    } else {
      res.send(403)
    }

  }
}



exports.transactionsHistory = function (options) {
  return function(req,res,next){
    if (req.headers.authorization == SECRET){
      User.findOne(
         { email: req.headers.email }
       ).then(user => {
        console.log(user);
        Transaction.find({
            userId: user.id
        }).then(transactions => {
          res.send(transactions);
        }).catch(err => {
          res.send(err);
        });
      }).catch(err => {
        res.send(403)
      })

    } else {
      res.send(403)
    }
  }
}
