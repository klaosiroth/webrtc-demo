import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 4000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`connect ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });
});

httpServer.listen(port, () => {
  console.log(`server is running at: http://localhost:${port}`);
});
