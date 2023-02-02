const http = require("http");
const express = require('express');
const cors = require("cors");
const socketIO = require("socket.io");

const port = process.env.PORT

const app = express();
const server = http.createServer(app);
const io = socketIO(server)
app.use(cors())

const users = [{}]

app.get("/", (req, res) => {
    res.send("hello guys")
})

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joined', ({ user }) => {
        users[socket.id] = user
        console.log(`${user} has joined`);
        socket.broadcast.emit("userJoined", { user: "Admin", message: `${users[socket.id]} has joined` })
        socket.emit('welcome', { user: "admin", message: `Welcome to the chat ${users[socket.id]}` })

    });

    socket.on('message', ({message, id}) => {
            io.emit('sendMessage', {user:users[id], message, id})
    })
    socket.on("disconnect",() => {
        socket.broadcast.emit('leave',{user : "Admin", message :  `${users[socket.id]} has left`})
        console.log("user left")
    })

});
console.log(users);
server.listen(port, () => {
    console.log(` server is working on port ${port}`)
})