import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
} from "react";
import { GlobalContext } from "../context/GlobalContext";
import styles from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";

// Define the structure of form errors
interface FormErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const [show, setShow] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  // Destructure values from GlobalContext, adding checks for undefined
  const { users, setUsers } = useContext(GlobalContext) || {}; // Ensure GlobalContext is available

  // Redirect to login if there's a signup in the URL
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("signup")) {
      navigate("/login"); // Redirect to /login if the URL has unnecessary segments like /signup/login
    }
  }, [navigate]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  console.log(users);
  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Ensure users are available before using them
      if (users) {
        const user = users.find(
          (user) => user.email === email && user.password === password
        );

        if (user) {
          // Set the active user to true by updating the user's active status
          if (setUsers) {
            setUsers(
              users.map(
                (user) =>
                  user.email === email && user.password === password
                    ? { ...user, active: true } // Set the active property to true
                    : { ...user, active: false } // Ensure other users are set to false
              )
            );
          }

          // Navigate to the main page or dashboard
          navigate("/main");
        } else {
          setFormErrors({
            ...formErrors,
            password: "Invalid email or password",
          });
        }
      }
    }
  };

  return (
    <div className={styles.loginform}>
      <div className={styles.main}>
        <p className={styles.p}>Log In</p>

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          placeholder="e.g jane.doe@gmail.com"
          id="email"
          className={styles.email}
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            autoComplete="off"
            spellCheck="false"
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
      </div>

      <div className={styles.login}>
        <button onClick={handleSubmit}>Log In</button>
        <div className={styles.footer}>
          <div className={styles.sign}>
            <p>Don't have an account?</p>
            <p className={styles.signup}>
              <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
