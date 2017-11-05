const Transaction = require('../models/transaction');
const config = require('../config');

const MAX_PURCHASES_PER_DAY = 3;

exports.buyProduct = function(req, res, next) {
  const yesterday = new Date(Date.now() - 864e5);
  const userId = req.body.user_id;
  const productId = req.body.product;
  const amount = req.body.amount;
  const id = req.user.id;

  console.log(id);

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
        // TODO Executes purchase
        return res.status(200).send({ succes: 'Bought'})

      }
    });
}
