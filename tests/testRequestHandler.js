var Handler = require('../src/RequestHandler');
var handler = new Handler();
var header = '<11>{"a" : "1"}<11>{"b" : "2"}';

handler.on("Query", function(query) {
  console.log("We received");
  console.log(query);
});

handler.handle(header);

console.log(handler._length, handler._string, handler._mode);
