var util = require('util');
var events = require('events');

function RequestHandler() {
  events.EventEmitter.call(this);
  this._string = "";
  this._query = "";
  this.length = 0;
  this._modes = new Array("Header","Query");
  this._mode = this._modes[0];
  this.queries = 0; 
}
util.inherits(RequestHandler, events.EventEmitter);

RequestHandler.prototype.handle = function(chunk) {
  if ((this._string+chunk) != "") {
    if (this._mode == this._modes[0]) {
      this._checkHeader(chunk);
    } else {
      this._checkQuery(chunk);
    }
  }
} 

/**
 * Throws wrong format exception
 * Throws no digit exception
 */
RequestHandler.prototype._checkHeader = function(chunk) {
  var lengthStr = "";
  var offset = this._string.length;
  this._string += chunk;
  this._query = "";
  if(this._string[0] != "<") {
    throw new Error("Wrong starting point " + this._string);
  } else {
    var i = 1;
    while (this._string[i] != ">" && i < this._string.length) {
      if (isNaN(parseInt(this._string[i]))) {
        throw new Error(this._string[i] + " is not a digit");
      }
      lengthStr += this._string[i];
      i++;
    }
    if (this._string[i] == ">") {
      i++;
      if (!isNaN(parseInt(lengthStr))) {
        this._length = parseInt(lengthStr);
        this._string = this._string.substr(i,this._string.length-i);
        this._mode = this._modes[1];
        this.handle("");
      } else {
        throw new Error("Wrong length " + lengthStr);
      }
    }
  }
}

/**
 * Throws JSON exception
 **/
RequestHandler.prototype._checkQuery = function(chunk) {
  this._string += chunk;
  if (this._string.substr(0,this._length).length == this._length) {
    this._query = JSON.parse(this._string.substr(0,this._length));
    this.emit("Query", this._query);
    this.queries++;
    this._mode = this._modes[0];
    this._query = "";
    this._string = this._string.substr(this._length,this._string.length-1);
    this.handle("");
  }
}

module.exports = RequestHandler;
