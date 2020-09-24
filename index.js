var app = require('express')();
var http  = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req,res) => {
 res.sendFile(__dirname + '/html/' + 'index.html');
});

io.on('connection',(socket) => {
	console.log('A user connected');
	socket.on('send-type', (recievertype) => {
		socket.EventType = recievertype;
		console.log (socket.EventType);
		if (socket.EventType == 'MainEventPlayer') {
                        socket.broadcast.emit('mainplayerconnected', {main: true});
                        //console.log('Playend from {' + socket.EventType + '}: ' + playend.id);
                }
	});
	socket.on('prepare-play', (prepplay) =>  {
		if (socket.EventType == 'RemoteControl') {
			socket.broadcast.emit('prep-play', prepplay);
			console.log('Prepare Playid ' + prepplay.id + ' (' + prepplay.type + '/' + prepplay.name + ') from {' + socket.EventType + '}' );
		}
	});
	socket.on('play-loaded-item', (play) =>  {
//		console.log(play);
                if (socket.EventType == 'RemoteControl') {
                        socket.broadcast.emit('play-loaded-item', play);
                        console.log('Play from {' + socket.EventType + '}: ' + play);
                }
        });
	socket.on('play-ended', (playend) =>  {
  //              console.log(playend);
                if (socket.EventType == 'MainEventPlayer') {
                        socket.broadcast.emit('play-ended', playend);
                        console.log('Playend from {' + socket.EventType + '}: ' + playend.id);
                }
        });
	socket.on('play-started', (playstart) =>  {
    //            console.log(playstart);
                if (socket.EventType == 'MainEventPlayer') {
                        socket.broadcast.emit('play-started', playstart);
                        console.log('Play start from {' + socket.EventType + '}: ' + playstart.id);
                }
        });
});

http.listen(3000, () => {
 console.log('open on port 3000');
});
