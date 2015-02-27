function StoresManager() {
  this._stores = new Object();
  this._stores.test = new (require('./Store'))("test");
}

StoreManager.parse = function (query) {
  var head = Object.keys(query)[0];
  if ( head !== "command") {
    return this[query[head]]();
  } else {
    if (this._stores[head] !== undefined) {
      String(this._stores[head].execute(request[store]));
    }
  }
};


StoreManager.getDbs = function (query) {
  return Object.keys(this._stores);
};
