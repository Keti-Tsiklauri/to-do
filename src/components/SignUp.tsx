import { useState, useContext } from "react";
import styles from "./signup.module.css";
import Main from "./Main";
import { GlobalContext } from "../context/GlobalContext";

export default function SignUp() {
  const [show, setShow] = useState(false);
  const [repeatShow, setRepeatShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);

  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("GlobalContext must be used within a GlobalProvider");
  }
  const { users, setUsers } = context;
  console.log(users);

  const validateForm = () => {
    const errors: any = {};

    if (!name.trim()) {
      errors.name = "Name is required.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
    } else {
      const hasUppercase = /[A-Z]/.test(password);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!hasUppercase) {
        errors.password =
          "Password must contain at least one uppercase letter.";
      }
      if (!hasSymbol) {
        errors.password = "Password must contain at least one symbol.";
      }
    }

    if (!repeatPassword.trim()) {
      errors.repeatPassword = "Please confirm your password.";
    } else if (password !== repeatPassword) {
      errors.repeatPassword = "Passwords do not match.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted successfully");

      const newUser = { name, email, password, active: true, tasks: [] };

      // First, set all users as inactive
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => ({
          ...user,
          active: false, // Set all users as inactive
        }));

        // Add the new user as active
        return [...updatedUsers, newUser];
      });

      console.log("Updated users array: ", users); // Log the updated users array

      setIsRegistered(true); // Display the Main component
    }
  };

  if (isRegistered) {
    return <Main />; // Render the Main component after successful signup
  }

  return (
    <div className={styles.signupform}>
      <div className={styles.main}>
        <p className={styles.p}>Sign up</p>

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          placeholder="e.g Jane Doe"
          id="name"
          className={styles.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {formErrors.name && <p className={styles.error}>{formErrors.name}</p>}
        <br />

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          placeholder="e.g jane.doe@gmail.com"
          id="email"
          className={styles.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {formErrors.email && <p className={styles.error}>{formErrors.email}</p>}
        <br />

        <label htmlFor="password">Password:</label>
        <div className={styles.password}>
          <input
            id="password"
            className={styles.pass}
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img
            onClick={() => setShow((prev) => !prev)}
            src={
              show
                ? "/images/icon-show-password.svg"
                : "/images/icon-hide-password.svg"
            }
            alt="Toggle Password Visibility"
          />
        </div>
        {formErrors.password && (
          <p className={styles.error}>{formErrors.password}</p>
        )}
        <br />

        <label htmlFor="repeatpassword">Repeat Password:</label>
        <div className={styles.repeatpassword}>
          <input
            id="repeatpassword"
            className={styles.pass}
            type={repeatShow ? "text" : "password"}
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          <img
            onClick={() => setRepeatShow((prev) => !prev)}
            src={
              repeatShow
                ? "/images/icon-show-password.svg"
                : "/images/icon-hide-password.svg"
            }
            alt="Toggle Repeat Password Visibility"
          />
        </div>
        {formErrors.repeatPassword && (
          <p className={styles.error}>{formErrors.repeatPassword}</p>
        )}
      </div>

      <div className={styles.signup}>
        <button onClick={handleSubmit}>Sign up</button>
        <p>Already have an account?</p>
        <p className={styles.login}>
          <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}
