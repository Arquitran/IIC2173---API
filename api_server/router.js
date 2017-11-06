const Authentication = require('./controllers/authentication');
const Transactions = require('./controllers/transactions');
const CartController = require('./controllers/cart');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.get('/api/protected', requireAuth, function(req, res) {
    res.send({ key: 'value' })
  });
  app.post('/api/signin', requireSignIn, Authentication.signin);
  app.post('/api/signup', Authentication.signup);
  app.post('/api/transactions', requireAuth, Transactions.buyProduct);

  app.post('/api/cart', requireAuth, CartController.processCart);
}
