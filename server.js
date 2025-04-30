// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/'));

io.on('connection', socket => {
  socket.on('join', room => {
    socket.join(room);
    const clients = io.sockets.adapter.rooms.get(room);
    if (clients.size > 1) {
      socket.to(room).emit('ready');
    }
  });

  socket.on('offer', data => socket.broadcast.emit('offer', data));
  socket.on('answer', data => socket.broadcast.emit('answer', data));
  socket.on('candidate', data => socket.broadcast.emit('candidate', data));
});

server.listen(3000, () => console.log('Server started on http://localhost:3000'));
