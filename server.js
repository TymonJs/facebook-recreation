const { createServer } = require('http');
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
})



io.on('connection', async (socket) => {
  socket.on('hejka', () => {
    console.log('joł');
  });
});

httpServer.listen(5000, () => {
  console.log("Listening at http://localhost:5000");
})