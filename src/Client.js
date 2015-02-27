var net = require('net');
var util = require('util');
var req = new (require('./RequestHandler'))();

function RemembroClient() {
  net.Socket.call(this);
  this._init();
}
util.inherits(RemembroClient,net.Socket);

RemembroClient.prototype._init = function(){
  this.connect(7907, function() { //'connect' listener
    console.log('client connected');
  });
}

RemembroClient.prototype.send = function(query) {
  var length = (""+query).length;
  var request = "<" + length + ">" + query; 
  //console.log("Sending " + request);
  this.write(request);
}

RemembroClient.prototype.onResponse = function(cb) {
    this.on('data', function(response) {
      req.handle(response.toString());   
    });
    req.on("Query", function(response){
      if (cb !== undefined && typeof cb == 'function' )cb(response);
    });
}

module.exports = RemembroClient;
