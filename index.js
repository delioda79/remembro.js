var Message = require('./src/Message');
var net = require('net');
var testStore = new (require('./src/Store'))("test");
var logger = new (require('./src/Logger'))();
var messNUm = 0;
var stores = new Object();
stores.test = testStore;
testStore.on("Log", logger.log);
var clients = new Array();

var server = net.createServer(function(client) { //'connection' listener
  client.send = function(query) {
  var length = (""+query).length;
  var request = "<" + length + ">" + query;
  this.write(request);
}
  clients.push(client);
  console.log(client.writable);
  var requestHandler = new (require('./src/RequestHandler'))();
  logger.log('server connected');
  logger.log("We have " + clients.length + " active clients");
  
  requestHandler.on("Query", function(query){
    execute(query);
  });
  
  
  function handle(data) {    
    try {
      requestHandler.handle(data);
    } catch (e) {
      logger.log(e);
      logger.log(data.toString());
    }
  }

  function execute(request){
      try {
        if (request != undefined) {
          var store = Object.keys(request)[0];
          if (store != undefined) {
            if (stores[store] == undefined) {
              stores[store] = new (require('./src/Store'))(store);
            }
            var query = stores[store].execute(request[store]);
            client.send((query) ? JSON.stringify(query): new Message(query));                  
          } else {
            logger.log("Store " + store + " doesn't exist");
          }
        } else {
          logger.log("Wrong request");
        }
      } catch (e) {
        logger.log("client on data error: " + e + " request: " + request);
      }
    }

  
  client.on('end', function() {
    var i = clients.indexOf(client);
    delete clients[i];
    clients.splice(i,1);
    logger.log('server disconnected');
    logger.log("We have " + clients.length + " active clients");
  });
  client.send('{"msg": "hello"}');
  client.on('data', handle);
  client.on('error', function(e) {
      console.log(e);
  });
});
server.listen(7907, function() { //'listening' listener
  logger.log('server bound');
});


