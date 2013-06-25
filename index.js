var net = require('net');
var testStore = new (require('./Store'))("test");
var logger = new (require('./Logger'))();

var stores = new Object();
stores.test = testStore;
testStore.on("Log", logger.log);

var server = net.createServer(function(client) { //'connection' listener
  
  client._requestedQuery = "";
  logger.log('server connected');
  
  function handle(data) {
    client._requestedQuery += data.toString();
    var queries = client._requestedQuery.split("\n");
    
    for (i in queries) {
      if (queries[i] != '') {
        try {
          var request = JSON.parse(queries[i]);
          execute(request);
          queries.splice(i,1); 
        }  catch (e) {
          logger.log("Handle error: " + e + " data: " + queries[i]);
        }
      } else {
        queries.splice(i,1); 
      }
    }
    client._requestedQuery = queries.join("\n"); 
    //console.log("We have" + client._requestedQuery);
  }

  function execute(request){
      try {
        if (request != undefined) {
          var store = Object.keys(request)[0];
          if (store != undefined && stores[store] != undefined) {
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
    logger.log('server disconnected');
  });
  client.write('hello\r\n');
  client.on('data', handle);
});
server.listen(7907, function() { //'listening' listener
  logger.log('server bound');
});


