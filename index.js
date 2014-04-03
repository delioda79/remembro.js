var net = require('net');
var testStore = new (require('./Store'))("test");
var logger = new (require('./Logger'))();
var messNUm = 0;
var stores = new Object();
stores.test = testStore;
testStore.on("Log", logger.log);
var clients = new Array();

var server = net.createServer(function(client) { //'connection' listener
  clients.push(client);
  var requestHandler = new (require('./RequestHandler'))();
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
    }
  }

  function execute(request){
      try {
        if (request != undefined) {
          var store = Object.keys(request)[0];
          if (store != undefined) {
            if (stores[store] == undefined) {
              stores[store] = new (require('./Store'))("test");
            }
            client.write(String(stores[store].execute(request[store])));
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
  client.write('hello\r\n');
  client.on('data', handle);
});
server.listen(7907, function() { //'listening' listener
  logger.log('server bound');
});


