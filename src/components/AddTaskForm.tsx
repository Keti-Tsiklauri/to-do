import React, { useState, useContext } from "react";
import styles from "./AddTaskForm.module.css";
import { GlobalContext } from "../context/GlobalContext";

const AddTaskForm = ({ close }) => {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error messages

  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    throw new Error("AddTaskForm must be used within a GlobalProvider");
  }

  const { users, setUsers } = globalContext;
  console.log(users);
  // Find the active user from the users array
  const activeUserData = users.find((user) => user.active === true);

  // Ensure there is an active user before proceeding
  if (!activeUserData) {
    setErrorMessage("No active user found.");
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset error message on each submission attempt
    setErrorMessage("");

    // Check if all fields are filled
    if (!taskName || !priority || !fromDate || !toDate) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // Check if "To Date" is not earlier than "From Date"
    if (new Date(toDate) < new Date(fromDate)) {
      setErrorMessage(
        "The start date must not be earlier than the finish date."
      );
      return;
    }

    // Create the new task object
    const newTask = {
      task: taskName,
      priorities: priority,
      from: fromDate,
      to: toDate,
    };

    // Update the active user's tasks
    const updatedUsers = users.map((user) =>
      user.active === true ? { ...user, tasks: [...user.tasks, newTask] } : user
    );

    // Update the users state with the new tasks
    setUsers(updatedUsers);

    // Close the form after saving the task
    close();
  };

  return (
    <div className={styles.form}>
      <svg
        onClick={close}
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
      <div className={styles.addTaskForm}>
        <h2>Add Task</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="">Select Priority</option>
              <option value="High Priority">High Priority</option>
              <option value="Medium Priority">Medium Priority</option>
              <option value="Low Priority">Low Priority</option>
              <option value="Critical">Critical</option>
              <option value="Urgent">Urgent</option>
              <option value="Important">Important</option>
              <option value="Not Urgent">Not Urgent</option>
              <option value="Less Important">Less Important</option>
            </select>
          </div>
          <div>
            <label>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <button type="submit">Save Task</button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
