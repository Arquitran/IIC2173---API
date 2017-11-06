const config = require('../config');
const Transactions = require('./transactions');

exports.processCart = function(req, res, next) {
  var responses = {};
  for(i in req.body) {

    console.log("se" + req.body[i].product_id);
    responses[req.body[i].product_id] = Transactions.buyProduct(req.body[i].product_id,req.body[i].amount, req.user._id);
  }

  console.log("response" + responses["1"]);
  return res.send({transactions: responses});
}
