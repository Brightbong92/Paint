const express = require('express');
const socket = require('socket.io');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http')
const server = http.createServer(app);

app.use(express.static(__dirname + '/static'))

app.get('/', (req, res) => {
    let agent = req.header('User-Agent');
    //console.log('User 접속 브라우저: ' + agent)
    res.sendFile(__dirname + "/index.html");
});

const io = socket(server);

io.sockets.on('connection', socket => {

    socket.on('newUser', name => {
        console.log(name + '님이 접속');

        socket.name = name;

        io.sockets.emit('chat', {type: 'connect', name: 'SERVER', message: name + '님이 접속'});
    })

    socket.on('message', data => {
        data.name = socket.name;

        console.log(data);

        socket.broadcast.emit('chat', data);
    })

    socket.on('sendCanvas', data => {
        console.log(data);

        socket.broadcast.emit('recvCanvas', data);
    });

    socket.on('disconnect', () => {
        console.log(socket.name + '님이 나감');

        socket.broadcast.emit('chat', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나감'});

    })
});


server.listen(port, () => {
    console.log(`server is listening at localhost`);
});