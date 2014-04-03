var net = require('net');
var client = new (require('./Client'))();


client.send('{"test2" : {"createCollection" : { "name" : "firstCollection"}}}\n');
for (i = 0; i <20000 ; i++) {
  //message = '{"test2" : { "firstCollection" : {"insert" : {"bu'+i+'" : "a'+i+'", "ba" : "e"}}}}\n';
  //client.send(message);
}
  //console.log("Done");
  //client.write('{"test2" : { "firstCollection" : {"find" : [{"bu10000" : ["a1998","a10000"]},{"bu4" : "a4"}]}}}\n');
  //client.write('{"test" : { "firstCollection" : {"find" : {"bu1905" : "a1905"}}}}\n');
  client.send('{"test2" : { "firstCollection" : {"find" : {"bu11" : "a11"}}}}');
  //client.send('{"test2" : { "firstCollection" : {"count" : ""}}}\n');


client.on('data', function(data) {
  if (data != 'true' ) {
    console.log(data.toString());
  }
  //client.end();
});
client.on('end', function() {
  console.log('client disconnected');
});
