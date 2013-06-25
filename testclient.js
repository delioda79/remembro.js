var net = require('net');
var client = net.connect(7907, function() { //'connect' listener
  console.log('client connected');
  client.write('{"test" : {"createCollection" : { "name" : "firstCollection"}}}\n');
  message = "";
  for (i = 0; i <2000 ; i++) {
    message += '{"test" : { "firstCollection" : {"insert" : {"bu'+i+'" : "a'+i+'", "ba" : "e"}}}}\n';
  }
  client.write(message);
  client.write('{"test" : { "firstCollection" : {"find" : [{"bu1998" : "a1998"},{"bu4" : "a4"}]}}}\n');
  //client.write('{"test" : { "firstCollection" : {"find" : {"bu423" : "a423"}}}}\n');
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
