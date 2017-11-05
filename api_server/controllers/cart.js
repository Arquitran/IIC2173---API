const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function genToken(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  res.send({ token: genToken(req.user) })
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'No Email or Password' });
  }

  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' })
    }

    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) {
        return next(err);
      }

      res.json({ token: genToken(user) });

    });

  });

}

exports.processCart = function(req, res, next) {
  console.log(req.body);
  for(i in req.body) {
    console.log(req.body[i]);
  }
  return res.send({body: req.body[1]});

}
