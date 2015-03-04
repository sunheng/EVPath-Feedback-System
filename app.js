var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

var io = require('socket.io').listen(app.listen(port));

app.use(express.static(__dirname + '/public'));

var routes = require('./routes')(app);

var events = require('./dashboard_service/sockets')(io);