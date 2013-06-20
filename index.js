var net = require('net');
var requester = new (require('./requester'))();

var server = net.createServer(function(client) { //'connection' listener
  console.log('server connected');
  client.on('end', function() {
    console.log('server disconnected');
  });
  client.write('hello\r\n');
  client.on('data',function(data){
    var request = JSON.parse(data);
    if (request != undefined) {
      if (requester[Object.keys(request)[0]] != undefined) {
        client.write(requester[Object.keys(request)[0]](request[Object.keys(request)[0]]));
      }
    }
  });
});
server.listen(7907, function() { //'listening' listener
  console.log('server bound');
});


