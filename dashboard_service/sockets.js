module.exports = function(io) {
  var net = require('net');

    io.on('connection', function (socket) {
      console.log('connected to socket.io');

      //Sample test 
      // socket.on('ready', function() {
        // i = 0;
        // while (i <= 3) {
        //   socket.emit('newImage', {
        //     'name' : 'added4',
        //     'src' : 'images/tif3.tif',
        //     'attributes' : 'attrbuteblah',
        //     'borderClass' : ''
        //   });
        //   i++;
        // }
      // });
      //END TEST

      socket.on('newChangeset', function(data) {
        socket.broadcast.emit('newChangeset', data);
      });

      socket.on('imageMarked', function(data) {
        socket.broadcast.emit('imageMarked', data);
      });

      // var client = new net.Socket();
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