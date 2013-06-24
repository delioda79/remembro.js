var events = require('events');
var util = require('util');

function Collection(name) {
  events.EventEmitter.call(this);
  this.name = name;
  this._data = new Array();
}
util.inherits(Collection, events.EventEmitter);

Collection.prototype.execute = function (request) {
  if (request != undefined) {
    var operation = Object.keys(request)[0];
    if (this[operation] != undefined && typeof this[operation] == "function") {
      var params = request[operation];
      return this[operation](params);
    } else {
      return new Error("Operation " + operation + " is not defined");
    }
  }
}

Collection.prototype.find = function(data) {
  console.log("Here we are");
  if (typeof data == "number") {
    return this._data[parseInt(data)];
  } else {
    var results = new Array();
    var i;
    for (i in this._data) {
      if (this._match(this._data[i],data)) {
        results.push(this._data[i]);
      }
    }
    return JSON.stringify(results);
  }
  
}

Collection.prototype.insert = function(data) {
  this._data.push(data);
  return true;
}


Collection.prototype._match = function (element,query) {
  var result = true;
  var i;
  for (i in query) {
    //Every key in the query must exist
    if(element[i] != undefined) {
      //@toDo
      if (query[i] instanceof Array) {
        //Still to decide how to search
      } else {
        //Recoursively search
        if (query[i] instanceof Object) {
          //if not matched return false, otehrwise carry on
          if (!this._match(element[i],query[i])) {
            return false;
          }
        } else {
          if (element[i] != query[i]) {
            return false;
          }
        }
      }
    } else {
      return false;
    }
  }
  return result;
}


module.exports = Collection;
