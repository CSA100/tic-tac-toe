import React, { useState, useEffect } from "react";
import styles from "../styles/board.module.css";
import cross from "../resources/cross.svg";
import circle from "../resources/circle.svg";
import "../styles/gridStyles.css";

const Board = ({ socket, room }) => {
  const [positions, setPositions] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [currentPlayer, setPlayer] = useState(null);
  const [status, setStatus] = useState("playing");

  // Load the socket
  useEffect(() => {
    socket.on("update", (state) => {
      console.log(state);
      setPositions(state.positions);
      setPlayer(state.currentPlayer);
      setStatus(state.status);
    });
  }, [socket]);

  const resetGame = () => {
    socket.emit("reset", room);
  };

  const handleItemClick = (pos) => {
    if (status === "playing" && currentPlayer === socket.id) {
      socket.emit("click", pos, room);
    }
  };

  const renderHeader = () => {
    if (status === "playing") {
      if (currentPlayer === socket.id) {
        return <h1 className={styles.header}>Your turn</h1>;
      } else {
        return <h1 className={styles.header}>Opponent's Turn</h1>;
      }
    } else if (status === "won") {
      if (currentPlayer === socket.id) {
        return <h1 className={styles.header}>You Win!</h1>;
      } else {
        return <h1 className={styles.header}>You Lose</h1>;
      }
    } else if (status === "draw") {
      return <h1 className={styles.header}>It's a draw</h1>;
    } else {
      return <h1 className={styles.header}>Loading...</h1>;
    }
  };

  const BoardItem = ({ position, shape, onClick }) => {
    const renderItem = () => {
      if (shape) {
        if (shape === "X") {
          return <img className={styles.image} src={cross} alt="cross" />;
        } else if (shape === "O") {
          return <img className={styles.image} src={circle} alt="circle" />;
        }
      }
    };

    return (
      <div onClick={onClick} className={`${styles.boardItem} ${position}`}>
        {renderItem()}
      </div>
    );
  };

  return (
    <>
      {renderHeader()}

      {status !== "playing" && (
        <button onClick={resetGame} className={styles.resetBtn}>
          New Game
        </button>
      )}

      <div className={styles.board}>
        <BoardItem
          position="one"
          shape={positions[0]}
          onClick={() => handleItemClick(0)}
        />
        <BoardItem
          position="two"
          shape={positions[1]}
          onClick={() => handleItemClick(1)}
        />
        <BoardItem
          position="three"
          shape={positions[2]}
          onClick={() => handleItemClick(2)}
        />
        <BoardItem
          position="four"
          shape={positions[3]}
          onClick={() => handleItemClick(3)}
        />
        <BoardItem
          position="five"
          shape={positions[4]}
          onClick={() => handleItemClick(4)}
        />
        <BoardItem
          position="six"
          shape={positions[5]}
          onClick={() => handleItemClick(5)}
        />
        <BoardItem
          position="seven"
          shape={positions[6]}
          onClick={() => handleItemClick(6)}
        />
        <BoardItem
          position="eight"
          shape={positions[7]}
          onClick={() => handleItemClick(7)}
        />
        <BoardItem
          position="nine"
          shape={positions[8]}
          onClick={() => handleItemClick(8)}
        />
      </div>
    </>
  );
};

export default Board;
