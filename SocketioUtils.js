//Export Object
var SocketioUtils = {};

var socket;
var setSocket = function(socket) {
	console.log("Set socket")
	this.socket = socket;
}

var setListener = function(listener) {
	console.log(this.socket);
	console.log(listener);
	if (socket === null) {
		return;
	}

	console.log(listener.name);
	console.log(listener.callback);

	this.socket.on(listener.name, listener.callback);
}

//Build Object
SocketioUtils.socket = socket;
SocketioUtils.setSocket = setSocket;
SocketioUtils.setListener = setListener;

module.exports = SocketioUtils;