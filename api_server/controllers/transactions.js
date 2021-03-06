const Transaction = require('../models/transaction');
const config = require('../config');
const request = require('request-promise');

const MAX_PURCHASES_PER_DAY = 3;

exports.canBuyProduct =function(productId, amount, userId) {
   new Promise(function(resolve, reject){
  const yesterday = new Date(Date.now() - 864e5);
  //const userId = req.body.user_id;
  var created = false;
  Transaction.find(
     {
       userId: userId,
       product: productId,
       createdAt: { $gte: yesterday},
     }
   ).exec((err, docs) => {
     if (err) {
       reject(false);
     }
     var count = docs.reduce(
       (sum, transaction) => sum + transaction.amount,
       0
     );

     console.log(`FIND ${count} PRODUCT ${productId}`);

     if (count > MAX_PURCHASES_PER_DAY) {
       console.log("NOT CREATED");
       created = false;
       reject(false);

     } else {
       const newTransaction = new Transaction({
         product: Number(productId),
         amount: Number(amount),
         userId: Number(userId),
       });
       newTransaction.save(function(err) {
         created = true;
         console.log("CREATED");
         resolve(true);
         }
       )}});

     console.log(`created ${created}` );
   })};

exports.transactionsHistory= function(req, res, next) {
    Transaction.find({
        userId: req.user.id
    }).then(transactions => {
      res.send(transactions);
    });
}
