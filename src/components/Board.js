import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/board.module.css";
import cross from "../cross.svg";
import circle from "../circle.svg";
import { render } from "@testing-library/react";

const BoardItem = ({ shape, onClick }) => {
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
    <div onClick={onClick} className={styles.boardItem}>
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
  const isMounted = useRef(false);

  const renderHeader = () => {
    if (won) {
      return <h1>Player {currentPlayer === 1 ? 2 : 1} wins!</h1>;
    }

    if (!won) {
      return <h1>Player {currentPlayer}'s turn!</h1>;
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      for (let i = 0; i < 7; i += 3) {
        //Check horizontal
        if (
          positions[i] &&
          positions[i] === positions[i + 1] &&
          positions[i] === positions[i + 2]
        ) {
          console.log("Player " + currentPlayer + " Wins! YAAAYY!");
          setWon(true);
        }
      }

      for (let i = 0; i < 3; i++) {
        //Check vertical wins
        if (
          positions[i] &&
          positions[i] === positions[i + 3] &&
          positions[i] === positions[i + 6]
        ) {
          console.log("Player " + currentPlayer + " Wins! YAAAYY!");
          setWon(true);
        }
      }

      //Check Diagonal wins
      if (
        positions[0] &&
        positions[0] === positions[4] &&
        positions[0] === positions[8]
      ) {
        console.log("Player " + currentPlayer + " Wins! YAAAYY!");
        setWon(true);
      }

      if (
        positions[2] &&
        positions[2] === positions[4] &&
        positions[2] === positions[6]
      ) {
        console.log("Player " + currentPlayer + " Wins! YAAAYY!");
        setWon(true);
      }

      if (!won) {
        setPlayer(currentPlayer === 1 ? 2 : 1);
      }
    } else {
      isMounted.current = true;
    }
  }, [positions]);

  const handleItemClick = (atPosition) => {
    if (!positions[atPosition] && !won) {
      const newPosition = positions.map((originalShape, position) => {
        if (position === atPosition && !originalShape) {
          return currentPlayer === 1 ? "X" : "O";
        } else {
          return originalShape;
        }
      });

      setPositions(newPosition);
    }
  };

  return (
    <>
      {renderHeader()}
      <div className={styles.board}>
        <BoardItem shape={positions[0]} onClick={() => handleItemClick(0)} />
        <BoardItem shape={positions[1]} onClick={() => handleItemClick(1)} />
        <BoardItem shape={positions[2]} onClick={() => handleItemClick(2)} />
        <BoardItem shape={positions[3]} onClick={() => handleItemClick(3)} />
        <BoardItem shape={positions[4]} onClick={() => handleItemClick(4)} />
        <BoardItem shape={positions[5]} onClick={() => handleItemClick(5)} />
        <BoardItem shape={positions[6]} onClick={() => handleItemClick(6)} />
        <BoardItem shape={positions[7]} onClick={() => handleItemClick(7)} />
        <BoardItem shape={positions[8]} onClick={() => handleItemClick(8)} />
      </div>
    </>
  );
};

export default Board;
