var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var names = {};

var port =  Number(process.env.PORT || 8000)
server.listen(port);
console.log('listening on port 8000');


//routes
app.get('/', function(req,res){
	res.sendfile(__dirname + '/index.html');
});

// allows client to connect to socket.io
io.sockets.on('connection', function(socket){
	
	function updateNames(){
		io.sockets.emit('usernames', Object.keys(names));
	}

	socket.on('sending_user', function(data, callback){
		// if statement that checks through the newly changed names object. 
		if (data in names){ 
			callback(false);
		} else{
		// else allows to store each user in socket, and push into names array
			callback(true);
			socket.name = data;
			names[socket.name] = socket;
			updateNames();

		}
	});

	socket.on('sending_message', function(data, callback){
		var msg = data.trim();
		if(msg.substr(0,5) === '/msg '){
			msg = msg.substr(5);
			var index = msg.indexOf(' ');
			if(index !== -1){
					var person = msg.substring(0, index);
					var msg =  msg.substring(index +1);
					if(person in names){
					names[person].emit('private_msg', {msg: msg, name: socket.name});	
					console.log("msg");	
			} else{
				callback('Enter a person who is online');
				}
			} else{
				callback("Please send a message for your private message");
			}
		} else{
				io.sockets.emit('new_message', {msg: msg, name: socket.name});
				}
			});
	
	socket.on('disconnect', function(data){
		if(!socket.name) return;
		// splices the elements in the array to allow users to disconnect
		delete names[socket.name];
		console.log(names);
		updateNames();
	});
});