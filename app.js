const express = require('express');
const { createServer } = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port  = 3000;

var lobbies = {};
var nextId = 0;

const Lobby = class {
    constructor() {
	this.clients = [];
	this.paths = [];
	this.host = null;
    }
}

io.on('connection', (socket) => {
    console.log('New socket connected!');

    socket.on('joinLobby', (data) => {
	if(!lobbies.hasOwnProperty(data.lobbyid)) return;
	console.log("Socket " + socket.id + " joined " + data.lobbyid);
	socket.join(data.lobbyid);
	socket.to(lobbies[data.lobbyid].host).emit('newClient', {
	    id: socket.id,
	    size: data.size
	});
    });

    socket.on('joinLobbyAsHost', (lobbyid) => {
	console.log('Setting host of lobby ' + lobbyid + ' to ' + socket.id);
	if(!lobbies.hasOwnProperty(lobbyid)) {
	    lobbies[lobbyid] = new Lobby();
	    nextId += 1;
	}
	socket.join(lobbyid);
	lobbies[lobbyid].host = socket.id;
    });

    socket.on('sendPath', (data) => {
	socket.to(lobbies[data.lobbyid].host).emit('newPath', {
	    segments: data.segments,
	    id: socket.id
	});
    });

    socket.on('disconnecting', (reason) => {
	console.log('Client disconnected');
	for (const room of socket.rooms) {
	    if (lobbies.hasOwnProperty(room)) {
		io.to(lobbies[room].host).emit('clientDisconnect', socket.id);
		return;
	    }
	}
    });
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/board', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/board.html'));
});

app.get('/draw', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/draw.html'));
});

app.post('/createlobby', (req, res) => {
    lobbies[nextId] = new Lobby();
    console.log('Created new lobby');
    nextId += 1;
    res.redirect('/board?lobbyid=' + (nextId-1));
});

httpServer.listen(port, () => {
    console.log('Server listening on port: ' + port);
});
