import React from "react";
import { useForm } from "react-hook-form";
import styles from "../styles/home.module.css";

const Form = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm();

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <input
        className={styles.input}
        type="text"
        name="createID"
        ref={register}
        placeholder="Enter room"
      />
      <button className={styles.btn} type="submit" name="createBtn">
        Create or Join Room
      </button>
    </form>
  );
};

export default Form;
