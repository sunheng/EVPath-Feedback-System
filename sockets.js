module.exports = function(io) {
  var net = require('net');

    io.on('connection', function (socket) {
      console.log('connected to socket.io');
      var client = new net.Socket();
      // client.connect(6813, "vogue1.cc.gatech.edu", function() {
      //     console.log('connected to evpath server');
      // });

      // client.on('data', function(data) {
      //     var received = JSON.parse(data);
      //     console.log(received);
      //     var hostname = received.data.hostname;
      //     socket.emit(hostname, received);
      // });
      
      // socket.on('disconnect', function() {
      //     client.destroy();
      // });

    });
};