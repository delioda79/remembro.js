function Requester() {
}

Requester.prototype.find = function(data) {
  return JSON.stringify(data);
}


module.exports = Requester;
