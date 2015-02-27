function Message(msg) {
    this.msg = msg;
}

Message.prototype.toString = function() {
    return '{"msg": "' + this.msg + '"}';
}

module.exports = Message;