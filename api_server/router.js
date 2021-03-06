const Authentication = require('./controllers/authentication');
const Transactions = require('./controllers/transactions');
const CartController = require('./controllers/cart');
const passportService = require('./services/passport');

const middleware = require('./services/middleware');

const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.get('/api/protected', requireAuth, function(req, res) {
    res.send({ key: 'value' })
  });
  app.post('/api/signin', requireSignIn, Authentication.signin);
  app.post('/api/signup', Authentication.signup);
  app.post('/api/cart',requireAuth, CartController.processCart);
  app.get('/api/cart/history',requireAuth, Transactions.transactionsHistory);

  app.post('/api/external/cart', middleware.processCart());
  app.get('/api/external/cart/history', middleware.transactionsHistory());

}
