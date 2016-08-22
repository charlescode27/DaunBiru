var express = require('express'),
    socketIO = require('socket.io'),
    app = express(),
    port = Number(process.env.PORT || 1000)
    ;

app.use(express.static(__dirname ));

app.get('/', function(req, res){
    res.sendfile('index.html');
});


var server = app.listen(port, function(){
    console.log('listening on *:' + port);
});


var io = socketIO.listen(server);

var users = [];
var sockets = [];

io.on('connection', function (socket) {    
    
    socket.on('message', function(message){
        
        if (message.type === 'user') {
            console.log('User connected: ' + message.user.name);        
            users.push(message.user);
            sockets.push(socket);
            for (var i = 0; i < users.length; ++i) {
                io.emit('connected', users[i]);       
            }                  
        }
        else if (message.type === 'text') {
            console.log('Text Message: ' + message.text);
            io.emit('message', message);    
        }
    
    });
    
    socket.on('disconnect', function(){
        var i = sockets.indexOf(socket);
        var user = users[i];
        console.log('User disconnected: ' + user.name);
        io.emit('disconnected', user);
        users.splice(i, 1);
        sockets.splice(i, 1);
    });
    
});