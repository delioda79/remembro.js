var net = require('net');
var client = net.connect(7907, function() { //'connect' listener
  console.log('client connected');
  client.write('{"test" : {"createCollection" : { "name" : "firstCollection"}}}\n');
  message = "";
  for (i = 0; i <3 ; i++) {
    message += '{"test" : { "firstCollection" : {"insert" : {"bu'+i+'" : "a'+i+'", "ba" : "e"}}}}\n';
  }
  client.write(message);
  //client.write('{"test" : { "firstCollection" : {"find" : {"bu1596" : "a1596"}}}}\n');
});
client.on('data', function(data) {
  if (data != 'true' ) {
    console.log(data.toString());
  }
  //client.end();
});
client.on('end', function() {
  console.log('client disconnected');
});
