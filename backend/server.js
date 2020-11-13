require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const socketIO = require("socket.io");
// const mongoose = require("mongoose");
const app = express();
// const Room = require("./roomManager");

// Middleware

app.use(cors());
//APIs

// Serve React Files

app.use(express.static(path.join(__dirname, "../build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
// Connect to Atlas and start server

// async function connect() {
//   try {
//     mongoose.Promise = global.Promise;
//     await mongoose.connect(process.env.ATLAS_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useFindAndModify: false,
//       useCreateIndex: true,
//     });
//     console.log("Connected to Atlas Succesfully");
//   } catch (err) {
//     console.log("Mongoose error", err);
//   }
// }

// connect();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log("Server Connected");
});

// Sockets IO

const io = socketIO(server, {
  cors: { origin: "*" },
});

let rooms = {};

const joinRoom = (socket, roomId) => {
  if (rooms[roomId]) {
    if (rooms[roomId].players.length < 2) {
      rooms[roomId].players.push(socket.id);
      rooms[roomId].state.ready = true;
      socket.join(roomId);
      io.to(roomId).emit("ready");
      console.log(socket.id + " has joined " + roomId);
    } else {
      console.log("ERROR room already has 2 players");
      socket.emit("roomFull");
    }
  } else {
    rooms[roomId] = {
      players: [socket.id],
      state: {
        positions: [null, null, null, null, null, null, null, null, null],
        currentPlayer: socket.id,
        status: "playing",
      },
    };
    socket.join(roomId);
    console.log(socket.id + " has joined " + roomId);
  }
};

const checkWinOrDraw = (p) => {
  // Check the position, return 0 if drawn, 1 if won else return 2

  // Check horizontal wins

  for (let i = 0; i < 7; i += 3) {
    if (p[i] && p[i] === p[i + 1] && p[i] === p[i + 2]) {
      return 1;
    }
  }

  //Check vertical wins

  for (let i = 0; i < 3; i++) {
    if (p[i] && p[i] === p[i + 3] && p[i] === p[i + 6]) {
      return 1;
    }
  }

  //Check Diagonal wins

  if (p[0] && p[0] === p[4] && p[0] === p[8]) {
    return 1;
  } else if (p[2] && p[2] === p[4] && p[2] === p[6]) {
    return 1;
  }

  // Check for Draw
  if (p.reduce((acc, val) => acc && val)) {
    return 0;
  }

  return 2;
};

const handleClick = (atPosition, room) => {
  if (!room.state.positions[atPosition]) {
    const newPosition = room.state.positions.map((originalShape, position) => {
      if (position === atPosition && !originalShape) {
        return room.state.currentPlayer === room.players[0] ? "O" : "X";
      } else {
        return originalShape;
      }
    });
    const w = checkWinOrDraw(newPosition);
    if (w === 1) {
      room.state.positions = newPosition;
      room.state.status = "won";
    } else if (w === 0) {
      room.state.positions = newPosition;
      room.state.status = "draw";
    } else {
      room.state.positions = newPosition;
      room.state.currentPlayer =
        room.players[(room.players.indexOf(room.state.currentPlayer) + 1) % 2];
    }
  }
};

io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  socket.on("joinRoom", (roomId) => {
    console.log("client trying to join " + roomId);
    joinRoom(socket, roomId);
    io.to(roomId).emit("update", rooms[roomId].state);
  });

  socket.on("click", (pos, roomId) => {
    const currentRoom = rooms[roomId];
    handleClick(pos, currentRoom);
    io.to(roomId).emit("update", currentRoom.state);
  });

  socket.on("reset", (roomId) => {
    const currentRoom = rooms[roomId];
    if (currentRoom) {
      currentRoom.state.positions = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];
      currentRoom.state.status = "playing";
      currentRoom.state.ready = true;
      io.to(roomId).emit("update", currentRoom.state);
    }
  });

  socket.on("disconnecting", () => {
    console.log(`client ${socket.id} disconnected`);
    const roomLeft = Array.from(socket.rooms)[1];

    if (rooms[roomLeft]) {
      rooms[roomLeft].players.splice(
        rooms[roomLeft].players.indexOf(socket.id),
        1
      );
      if (rooms[roomLeft].players.length === 0) {
        delete rooms[roomLeft];
      } else {
        rooms[roomLeft].state = {
          positions: [null, null, null, null, null, null, null, null, null],
          currentPlayer: rooms[roomLeft].players[0],
          status: "playing",
        };
        io.to(roomLeft).emit("update", rooms[roomLeft].state);
        io.to(roomLeft).emit("playerLeft");
      }
    }
  });
});
