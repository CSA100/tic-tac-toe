import React from "react";
import Board from "./Board";
import "../styles/index.css";
import styles from "../styles/home.module.css";

export default function App() {
  return (
    <div className={styles.home}>
      <div>
        <div className={styles.board}>
          <Board />
        </div>
      </div>
    </div>
  );
}
