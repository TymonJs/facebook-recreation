const { createServer } = require('http');
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH']
  }
})

const getRoomName = (arr) => {
  return arr.sort().toString()
}

io.on('connection', async (socket) => {  
  socket.on("connected",(arr) => {
    socket.join(getRoomName(arr))
  })
  socket.on("message", (obj) => {
    const {from,to,text} = obj
    io.to(getRoomName([from,to])).emit("message",obj)
  })
  socket.on("deleteMessage", (obj) => {
    const {loggedLogin,login,msgs} = obj
    io.to(getRoomName([loggedLogin,login])).emit("deleteMessage",msgs)
  })
  socket.on("editMessage", obj => {
    const {loggedLogin,login,text,id} = obj
    io.to(getRoomName([loggedLogin,login])).emit("editMessage",{text,id})
  })
});

httpServer.listen(5000, () => {
  console.log("Listening at http://localhost:5000");
})