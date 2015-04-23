var express     = require('express');
var app         = express();
var port        = process.env.PORT || 3000;
var passport    = require('passport');
var flash       = require('connect-flash');
var redis       = require('redis');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var io = require('socket.io').listen(app.listen(port));

// redis connection
var dbConfig = require('./config/database');
var redisClient = redis.createClient(dbConfig.port, dbConfig.host);
redisClient.on('connect', function() {
  console.log('redis connected');
});

require('./config/passport')(passport, redisClient); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
  extended: true
})); // get information from html forms

// required for passport
app.use(session({
  secret: 'kervoisthebest',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs'); // set up ejs for templating

var routes = require('./routes')(app, passport);

/* DB layer */
var data_handler = require('./data_access/access_handler')(redisClient);
var events = require('./dashboard_service/sockets')(io, data_handler);