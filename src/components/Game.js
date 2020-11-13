import React from "react";
import socketIOClient from "socket.io-client";
import Board from "./Board";
import styles from "../styles/home.module.css";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: "waiting" };
  }

  componentDidMount() {
    this.socket = socketIOClient("http://localhost:5000");

    this.socket.emit("joinRoom", this.props.room);

    this.socket.on("playerLeft", () => {
      this.setState({ status: "waiting" });
    });

    this.socket.on("ready", () => {
      this.setState({ status: "playing" });
    });

    this.socket.on("roomFull", () => {
      this.setState({ status: "full" });
    });
  }

  renderMessage() {
    if (this.state.status === "waiting") {
      return <h1 className={styles.message}>Waiting for players...</h1>;
    } else if (this.state.status === "full") {
      return (
        <>
          <h1 className={styles.message}>Room is full</h1>
          <button
            className={styles.btn}
            onClick={() => window.location.reload()}
          >
            Go Back
          </button>
        </>
      );
    }
  }

  render() {
    return (
      <div className={styles.home}>
        {this.renderMessage()}
        {this.state.status === "playing" && (
          <Board socket={this.socket} room={this.props.room} />
        )}
      </div>
    );
  }
}

export default Game;
