const express = require('express');
const http    = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// serve static files from public/
app.use(express.static('public'));

io.on('connection', socket => {
  socket.on('broadcaster', () => {
    socket.broadcast.emit('broadcaster');
  });

  socket.on('watcher', () => {
    socket.to(broadcasterSocketId).emit('watcher', socket.id);
  });

  socket.on('offer', (id, description) => {
    socket.to(id).emit('offer', socket.id, description);
  });

  socket.on('answer', (id, description) => {
    socket.to(id).emit('answer', socket.id, description);
  });

  socket.on('candidate', (id, candidate) => {
    socket.to(id).emit('candidate', socket.id, candidate);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('disconnectPeer', socket.id);
  });
});

// track the current broadcaster
let broadcasterSocketId = null;
io.on('connection', socket => {
  socket.on('broadcaster', () => {
    broadcasterSocketId = socket.id;
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Signaling server running on port ${PORT}`));
