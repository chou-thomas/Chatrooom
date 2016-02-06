var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var names = [];

server.listen(8000);
console.log('listening on port 8000');


//routes
app.get('/', function(req,res){
	res.sendfile(__dirname + '/index.html');
});

// allows client to connect to socket.io
io.sockets.on('connection', function(socket){
	
	function updateNames(){
		io.sockets.emit('usernames', names);
	}

	socket.on('sending_user', function(data, callback){
		// if statement that checks if the index in names array does not equal -1, proves if name exists
		if (names.indexOf(data) != -1){ 
			callback(false);
		} else{
		// else allows to store each user in socket, and push into names array
			callback(true);
			socket.name = data;
			names.push(socket.name);
			updateNames();

		}
	});

	socket.on('sending_message', function(data){
		io.sockets.emit('new_message', {msg: data, name: socket.name});
	});
	
	socket.on('disconnect', function(data){
		if(!socket.name) return;
		// splices the elements in the array to allow users to disconnect
		names.splice(names.indexOf(socket.name), 1);
		console.log(names);
		updateNames();
	});
});