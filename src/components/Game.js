import React, { useState } from "react";
import Board from "./Board";

const Game = () => {
  const positions = ["X", "X", "O", "O", "X", "O", "X", "O", "X"];

  return <Board positions={positions} />;
};

export default Game;
