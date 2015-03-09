var Collection = require ('./Collection');
var util = require('util');
var events = require('events');
var Message = require('./Message');

function Store(name) {
  events.EventEmitter.call(this);
  this.name = name;
  this._collections = new Object();
  
}
util.inherits(Store, events.EventEmitter);

Store.prototype.execute = function (request) {
  try {
      if (request != undefined) {
        var operation = Object.keys(request)[0];
        if (operation != undefined) {
          var params = request[operation];
          //Check if the operation is Store method
          if (this[operation] != undefined && typeof this[operation] == "function") {
                return this[operation](params);
          } else {
            //Check if operation is a colelction instead
            if (this._collections[operation] != undefined) {
              return this._collections[operation].execute(params);
            } else {
              //No method nor collection found
              var msg = "The collection " + operation + " doesn't exist";
              return new Message(msg);
            }
          }
        } else {
          return new Message("Missing collection");
        }
      } else {
        return new Message("Wrong request");
      }
    } catch (e) {
      this.emit("Log","Store execute error: " + e + " - passed parameters: " + JSON.stringify(request) );
    }
};

Store.prototype.createCollection = function(data) {
  if (data != null && data.name != undefined && typeof data.name == "string" ) {
    if (this._collections[data.name] == undefined) {
      var collection = new Collection(data.name);
      this._collections[data.name] = collection;
      return new Message('Collection' + data.name + ' created');
    } else {
      var message = new Error("The collection with name: " + data.name + " already exists");
      this.emit("Log",message);
      return new Message(message);
    }
  } else {
    var message = new Error("Tried to create a collection with data: " + JSON.stringify(data));
    this.emit("Log",message);
    return new Message(message);
  }
}

Store.prototype.deleteCollection = function(data) {
  if (data != null && data.name != undefined && typeof data.name == "string" ) {
    if (this._collections[data.name] != undefined) {
      this._collections[data.name] = undefined;
      return new Message("Collection " + data.name + " created");
    } else {
      var message = new Error("The collection with name: " + data.name + " doesn't exists");
      this.emit("Log",message);
      return new Message(message);
    }
  } else {
    var message = new Error("Tried to delete a collection with data: " + JSON.stringify(data));
    this.emit("Log",message);
    return new Message(message);
  }
}

Store.prototype.emptyCollection = function(data) {
  if (data != null && data.name != undefined && typeof data.name == "string" ) {
    if (this._collections[data.name] != undefined) {
      this._collections[data.name] = collection;
      return new Message("Collection " + data.name + " emptied");
    } else {
      var message = new Error("The collection with name: " + data.name + " does not exists");
      this.emit("Log",message);
      return new Message(message);
    }
  } else {
    var message = new Error("Tried to empty a collection with data: " + JSON.stringify(data));
    this.emit("Log",message);
    return new Message(message);
  }
}

Store.prototype.compoundQuery = function(specs) {
    if (specs['source'] == undefined || specs['target'] == undefined) {
        return new Message("Wrong compound query " + JSON.stringify(specs));
    }
    var collection = this.execute(specs['source']);
    
    if (collection instanceof Message) {
        return collection;
    }
    var subquery = new Collection("temp", collection);
    return subquery.execute(specs['target']);
}

module.exports = Store;
