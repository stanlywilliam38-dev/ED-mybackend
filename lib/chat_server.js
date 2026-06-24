const chat_routes = require('../src/chat_routes')

var socketio = require('socket.io')();
var io;
let users = {};
module.exports.listen = function (server) {
	io = socketio.listen(server);
	io.sockets.on('connection', function (socket) {
		socket.emit('connected', "hello");
		socket.on('set_userId', ({ userId }) => {
			users[userId] = socket.id
		})
		chat_routes(socket, io, users);
	})
}