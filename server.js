const { WebSocketServer } = require('ws');
const express = require('express');
const app = express();
const path = require('path');
const webServer = require('http').createServer(app);
const {Server } = require('socket.io');
const io = new Server(webServer);
const port = process.env.PORT || 5174;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

webServer.listen(port, () => {
  console.log(`API and web socket server is running on port ${port}`);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));


var namespaces = io.of(/^\/[0-9]{7}$/);
namespaces.on('connect', function(socket) {
    const namespace = socket.nsp;
    console.log("New chat client");
    socket.broadcast.emit('signal', 'new arrival');
    socket.on('signal', function(data) {
        socket.broadcast.emit('signal', data);
    });
    socket.on('disconnect', () => {
    namespace.emit('hi', 'A user disconnected');
  }); 
});