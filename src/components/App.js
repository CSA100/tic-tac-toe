import React, { useState } from "react";
import Game from "./Game";
import "../styles/index.css";
import styles from "../styles/home.module.css";
import Form from "./Form";

const App = () => {
  const [room, setRoom] = useState(null);

  const onSubmit = (data) => {
    setRoom(data.createID);
  };

  return (
    <>
      {!room && (
        <div className={styles.welcome}>
          <h1 className={styles.formHeader}>Play Tic Tac Toe</h1>
          <Form onSubmit={onSubmit} />
        </div>
      )}
      {room && <Game room={room} />}
    </>
  );
};

export default App;
