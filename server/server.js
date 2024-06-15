const http = require('http');
const app = require('./app');

require('dotenv').config();

const PORT = process.env.PORT || 5000;
console.log(process.env.MONGODB_URI);
// connect to db
require('./helpers/dbConnect');

const server = http.createServer(app);

const socketIO = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

let users = [];

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`)
  socket.on("message", data => {
    socketIO.emit("messageResponse", data)
  })

  socket.on("typing", data => (
    socket.broadcast.emit("typingResponse", data)
  ))

  socket.on("newUser", data => {
    console.log('newuser data', data);
    let checksocket = users.filter((user) => user.id == data.id)
    if (checksocket.length == 0) {
      !users.some((user) => user.id === data.id) &&
        users.push(data)
    }
    console.log('users', users);
    socketIO.emit("newUserResponse", users)
  })

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    users = users.filter(user => user.socketID !== socket.id)
    socketIO.emit("newUserResponse", users)
    socket.disconnect()
  });
});

server.listen(PORT, () => {
  console.log('Server Listening on port ' + PORT);
});