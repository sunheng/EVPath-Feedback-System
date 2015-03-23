module.exports = function (app, passport) {

  // Home/Login page
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
  });

  // Process login credentials
  app.post('/login',
    passport.authenticate('local', { failureRedirect: '/dashboard' }),
    function(req, res) {
      res.redirect('/dashboard');
  });

  // Dashboard page
  app.get('/dashboard', isLoggedIn, function(req, res) {
    res.sendFile(__dirname + '/views/dashboard.html', {user: req.user}); // Get user out of session
  });
  
  // Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

// Route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (!req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
