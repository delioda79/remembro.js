var events = require('events');
var util = require('util');

function Collection(name, data) {
  events.EventEmitter.call(this);
  this.name = name;
  this._data = (data != undefined && data instanceof Array) ? data : new Array();
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
    //the query is a set of criteria so we iterate through all criteria
    //per each item to match them
    if (data instanceof Array) {
      var results = new Array();
      for (var i in this._data) {
        for (var j in data) {
          if (this._match(this._data[i],data[j])) {
            results.push(this._data[i]);
            break;
          }
        }
      }
      //The mathicng condition is only one so we match all items against it
    } else {
      var results = new Array();
      var i;
      for (i in this._data) {
        if (this._match(this._data[i],data)) {
          results.push(this._data[i]);
        }
      }
    }
    return results;
  }
  
}

Collection.prototype.insert = function(data) {
  this._data.push(data);
  return true;
}

Collection.prototype.count = function(data) {
  return this._data.length;
}


Collection.prototype._match = function (element,query) {
  var result = true;
  var i;
  //console.log(element, query);
  for (i in query) {
    //Every key in the query must exist
    if(element[i] != undefined) {
      //@toDo
      if (query[i] instanceof Array) {
        var orResult = false;
        for (var j in query[i]) {
          if (this._match(element[i],query[i][j])) {
            //Is an or, so one match is enough
            return true;
          }
        }
        //No match, hence is false
        return orResult;
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
          } else {
            return true;
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
