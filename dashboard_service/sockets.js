module.exports = function(io) {
  var net = require('net');
  var client = new net.Socket();

  io.on('connection', function (socket) {
    console.log('connected to socket.io');

    socket.on('newChangeset', function(data) {
      socket.broadcast.emit('newChangeset', data);
    });

    socket.on('imageMarked', function(data) {
      socket.broadcast.emit('imageMarked', data);
    });

    var client = new net.Socket();
    client.connect(6813, "vogue1.cc.gatech.edu", function() {
        console.log('connected to evpath server');
    });

    //TO DO: Need to send a FIN packet after each image in order to reach ' on end '
    var data = '';
    client.on('data', function(chunk) {
      data += chunk;
      // console.log(data);
      // console.log(chunk);
    });

    client.on('end', function(){
      var received = JSON.parse(data);
      console.log(received);
      var base64_file_buf = received.data.base64_file_buf;
      socket.emit('newFile', received);
    });

    socket.on('disconnect', function() {
        client.destroy();
    });
  });
};