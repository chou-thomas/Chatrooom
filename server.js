var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8000);
console.log('listening on port 8000');


//routes
app.get('/', function(req,res){
	res.sendfile(__dirname + '/index.html');
});

// allows client to connect to socket.io
io.sockets.on('connection', function(socket){
	socket.on('sending_message', function(data){
		io.sockets.emit('new message', data);
		// socket.broadcast.emit('new message', data);
	});
});