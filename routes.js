module.exports = function (app, passport) {

  // Home/Login page
  app.get('/', function(req, res) {
    res.render('index.ejs', { message: req.flash('loginMessage'), registerMessage: req.flash('registerMessage') });
  });

  // Process login credentials
  app.post('/login',
    passport.authenticate('local-login', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/dashboard');
  });

  // Process register
  app.post('/register',
    passport.authenticate('local-register', {
    successRedirect : '/dashboard', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // Dashboard page
  app.get('/dashboard', isLoggedIn, function(req, res) {
    // console.log(req.user);
    //Expose only non confidential information to the client
    var externalUser = {
      username: req.user.username
    };
    res.render('dashboard.ejs', { user: externalUser});
  });
  
  // Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
