const Transaction = require('../models/transaction');
const config = require('../config');
const request = require('request-promise');

const MAX_PURCHASES_PER_DAY = 3;

exports.canBuyProduct = function(productId, amount, userId) {
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
       return 1000;
     }
     var count = docs.reduce(
       (sum, transaction) => sum + transaction.amount,
       0
     );

     console.log(`FIND ${count} PRODUCT ${productId}`);

     if (count > MAX_PURCHASES_PER_DAY) {
       console.log("NOT CREATED");
       created = false;

     } else {
       const newTransaction = new Transaction({
         product: Number(productId),
         amount: Number(amount),
         userId: Number(userId),
       });
       newTransaction.save(function(err) {
         created = true;
         console.log("CREATED");
         return true;
         }
       )}});

     console.log(`created ${created}` );
     return created;
   };
