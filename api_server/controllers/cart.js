const config = require('../config');

exports.processCart = function(req, res, next) {
  console.log(req.body);
  for(i in req.body) {
    console.log(req.body[i]);
  }
  return res.send({body: req.body[1]});

}
