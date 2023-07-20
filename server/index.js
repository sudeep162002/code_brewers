import "dotenv/config";

import {
  assignProfile,
  playerProfileArray,
} from "./utils/multiplayersFunction.js";

import Express from "express";
import cors from "cors";
import { createServer } from "http";
import socketConnection from "./socketConnection/socketConnection.js";

const app = Express();

app.use(cors({ origin: "*" }));

app.get("/check", (req, res) => {
  res.send("welcome to fastf");
});

const server = createServer(app);
// connectin to the socket server
const io = socketConnection(server);
let activeSockets = [];
const playersResult = {};
const resultPop = {};

io.on("connection", (socket) => {
  console.log("Server connected", socket.id);
  socket.emit("connected", { connected: socket.id });
  console.log(io.sockets.adapter.rooms);
  socket.on("disconnect", () => {
    console.log(io.sockets.adapter.rooms);
  });
  // socket.on("StartGame", (room) => {
  //   io.to(room).emit("start", { start: true });
  // });
  socket.on("create", (room) => {
    socket.join(room);
    console.log(io.sockets.adapter.rooms, [
      ...io.sockets.adapter.rooms.get(room),
    ]);
    // io.to(room)

    io.to(room).emit("room_members", {
      members: [...io.sockets.adapter.rooms.get(room)],
      assignedProfiles: assignProfile(playerProfileArray, [
        ...io.sockets.adapter.rooms.get(room),
      ]),
    });
  });

  socket.on("startgame", (room) => {
    io.to(room).emit("startTime", { msg: "start game" });
  });

  // =======================================to be completed
  socket.on("roomResult", (data) => {
    io.to(data.room).emit("showResult", data);
  });
  // =======================================
  socket.on("onData", (room) => {
    io.to(room).emit("restart_game", room);
  });

  socket.on("resultPop", (data) => {
    try {
      let roomId = data?.roomId;
      let userId = data?.id; // Move userId declaration outside of if statements
      if (!resultPop[roomId]) {
        resultPop[roomId] = {};
      }
      if (!resultPop[roomId][userId]) {
        resultPop[roomId][userId] = data;
      }
      resultPop[roomId][userId] = data;
    } catch (error) {
      console.log(error);
    }
    socket.emit("onRoomResult", resultPop[data.roomId]);
  });

  socket.on("scoreboardService", (data) => {
    try {
      let roomId = data?.roomId;
      let userId = data?.id; // Move userId declaration outside of if statements
      if (!resultPop[roomId]) {
        resultPop[roomId] = {};
      }
      if (!resultPop[roomId][userId]) {
        resultPop[roomId][userId] = data;
      }
      resultPop[roomId][userId] = data;
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("keydown", (data) => {
    console.log(socket.id, data);
    io.to(data.room).emit("room_update", { ...data, id: socket.id });
    // socket.broadcast
    //   .to(data.room)
    //   .emit("room_update", { ...data, id: socket.id });
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server is running on PORT ${process.env.PORT}`);
});
