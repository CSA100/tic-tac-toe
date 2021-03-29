class Room {
  constructor(options) {
    this.io = options.io;
    this.socket = options.socket;
    this.roomId = options.roomId;
    this.action = options.action;
    this.state = options.state;
    this.players = [];
  }

  async init() {
    let clients = await this.io.in(this.roomId).allSockets();
    console.log(clients);

    if (this.action === "create") {
      if (clients.size >= 0) {
        await this.socket.join(this.roomId);
        console.log(
          `Success, ${this.socket.id} has joined room ${this.roomId}`
        );
        this.players = Array.from(clients);
        if (this.players.length === 0) {
          this.state.currentPlayer = this.socket.id;
        }
        this.players.push(this.socket.id);
        console.log(this.players);
        this.socket.emit("Initialised");
      } else {
        console.log("Room already exists");
      }
    }

    if (this.action === "join") {
      if (clients.size > 1) {
        await this.socket.join(this.roomId);
        console.log(
          `Success, ${this.socket.id} has joined room ${this.roomId}`
        );
        this.players = Array.from(clients);
        this.players.push(this.socket.id);
        this.socket.emit("Initialised");
      } else {
        console.log("Room doesn't exist");
      }
    }
  }

  _checkWinOrDraw(p) {
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
  }

  _handleClick(atPosition) {
    if (!this.state.positions[atPosition]) {
      const newPosition = this.state.positions.map(
        (originalShape, position) => {
          if (position === atPosition && !originalShape) {
            return this.state.currentPlayer === this.players[0] ? "O" : "X";
          } else {
            return originalShape;
          }
        }
      );
      const w = this._checkWinOrDraw(newPosition);
      if (w === 1) {
        this.state.positions = newPosition;
        this.state.status = "won";
      } else if (w === 0) {
        this.state.positions = newPosition;
        this.state.status = "draw";
      } else {
        this.state.positions = newPosition;
        console.log(this.players);
        this.state.currentPlayer = this.players[
          this.players.indexOf(this.state.currentPlayer) + 1
        ];
      }
    }
  }

  startGame() {
    this.io.to(this.roomId).emit("update", this.state);

    this.socket.on("click", (position) => {
      this._handleClick(position);
      console.log(this.state);
      this.io.to(this.roomId).emit("update", this.state);
    });

    this.socket.on("reset", () => {
      this.state = {
        positions: [null, null, null, null, null, null, null, null, null],
        currentPlayer: this.players[0],
        status: "playing",
      };
      this.io.to(this.r).emit("update", this.state);
    });

    this.socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  }
}

module.exports = Room;
