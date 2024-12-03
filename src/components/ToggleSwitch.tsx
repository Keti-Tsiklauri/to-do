import styles from "./toggleSwitch.module.css";
import { GlobalContext } from "../context/GlobalContext";
import { useContext } from "react";

const ToggleSwitch = () => {
  const { setDark, dark } = useContext(GlobalContext)!; // Non-null assertion because we know the context will be provided
  console.log(dark);
  return (
    <div className={styles.container}>
      <img src="images/icon-sun-dark.svg" alt="Sun Icon" />
      <label className={styles.switch}>
        <input type="checkbox" onClick={() => setDark((prev) => !prev)} />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
      <img src="images/icon-moon-dark.svg" alt="Moon Icon" />
    </div>
  );
};

export default ToggleSwitch;
