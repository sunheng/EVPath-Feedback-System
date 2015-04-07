module.exports = function(io) {
  var net = require('net');
  var client = new net.Socket();

  io.on('connection', function (socket) {
    console.log('connected to socket.io');

    socket.on('decision', function(data) {
      socket.broadcast.emit('decision', data);
    });

    var client = new net.Socket();
    client.connect(6813, "vogue1.cc.gatech.edu", function() {
        console.log('connected to evpath server');
    });

    var data = '';
    client.on('data', function(chunk) {
      data += chunk;
      try {
        var received = JSON.parse(data);
        data = '';
        console.log(received);
        socket.emit('newFile', received);
      } catch (e) {

      }
    });

    socket.on('disconnect', function() {
        client.destroy();
    });
  });
};