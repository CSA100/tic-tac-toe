import React, { useState } from "react";
import styles from "../styles/board.module.css";
import cross from "../cross.svg";
import circle from "../circle.svg";
import "../styles/gridBorders.css";

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

const Board = () => {
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
  const [currentPlayer, setPlayer] = useState(1);
  const [won, setWon] = useState(false);

  const resetGame = () => {
    setPositions([null, null, null, null, null, null, null, null, null]);
    setPlayer(1);
    setWon(false);
  };

  const checkWin = (p) => {
    for (let i = 0; i < 7; i += 3) {
      //Check horizontal
      if (p[i] && p[i] === p[i + 1] && p[i] === p[i + 2]) {
        return true;
      }
    }
    //Check vertical wins
    for (let i = 0; i < 3; i++) {
      if (p[i] && p[i] === p[i + 3] && p[i] === p[i + 6]) {
        return true;
      }
    }

    //Check Diagonal wins
    if (p[0] && p[0] === p[4] && p[0] === p[8]) {
      return true;
    } else if (p[2] && p[2] === p[4] && p[2] === p[6]) {
      return true;
    }

    return false;
  };

  const handleItemClick = (atPosition) => {
    if (!positions[atPosition] && !won) {
      const newPosition = positions.map((originalShape, position) => {
        if (position === atPosition && !originalShape) {
          return currentPlayer === 1 ? "O" : "X";
        } else {
          return originalShape;
        }
      });
      const w = checkWin(newPosition);
      if (w) {
        setPositions(newPosition);
        setWon(true);
      } else {
        setPositions(newPosition);
        setPlayer((c) => (currentPlayer === 1 ? 2 : 1));
      }
    }
  };

  const renderHeader = () => {
    if (won) {
      return <h1 className={styles.header}>Player {currentPlayer} wins!</h1>;
    }

    if (!won) {
      return <h1 className={styles.header}>Player {currentPlayer}</h1>;
    }
  };

  return (
    <>
      {renderHeader()}
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

      {won && (
        <button onClick={resetGame} className={styles.resetBtn}>
          New Game
        </button>
      )}
    </>
  );
};

export default Board;
