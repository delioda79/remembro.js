var net = require('net');
var client = net.connect(7907, function() { //'connect' listener
  console.log('client connected');
  client.write('{"find" : {"bu" : "a"}}');
});
client.on('data', function(data) {
  console.log(data.toString());
  client.end();
});
client.on('end', function() {
  console.log('client disconnected');
});
