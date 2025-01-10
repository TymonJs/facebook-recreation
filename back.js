const { createServer } = require('http');
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
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
    console.log("wysyłam msg");
    
    io.to(getRoomName([from,to])).emit("message",obj)
    
    
  })
});

httpServer.listen(5000, () => {
  console.log("Listening at http://localhost:5000");
})