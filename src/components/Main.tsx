import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import AddTaskForm from "./AddTaskForm";
import styles from "./mainPage.module.css";

const priorityMap: Record<string, number> = {
  Critical: 7,
  Urgent: 6,
  "High Priority": 5,
  Important: 4,
  "Medium Priority": 3,
  "Low Priority": 2,
  "Not Urgent": 1,
  "Less Important": 0,
};

export default function Main() {
  const context = useContext(GlobalContext);
  const [showAddTask, setShowAddTask] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [todo, setToDo] = useState(true);
  const [notes, setNotes] = useState(false);
  const [noteList, setNoteList] = useState<string[]>([]);
  const [newNoteText, setNewNoteText] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // For editing
  const [deadlineSortOrder, setDeadlineSortOrder] = useState<
    "newest" | "oldest" | ""
  >("newest");

  if (!context) {
    throw new Error("GlobalContext must be used within a GlobalProvider");
  }

  const { users, setUsers } = context;
  const navigate = useNavigate();

  const activeUserIndex = users.findIndex((user) => user.active);
  const activeUser = users[activeUserIndex];

  if (!activeUser) {
    return <p>No active user found!</p>;
  }

  const tasks = activeUser.tasks;
  const doneTasks = activeUser.doneTasks;

  const handleLogout = () => {
    navigate("/");
  };

  const moveToDone = (taskIndex: number) => {
    const taskToMove = tasks[taskIndex];
    const updatedTasks = tasks.filter((_, index) => index !== taskIndex);
    const updatedDoneTasks = [...doneTasks, taskToMove];

    const updatedUsers = [...users];
    updatedUsers[activeUserIndex] = {
      ...activeUser,
      tasks: updatedTasks,
      doneTasks: updatedDoneTasks,
    };

    setUsers(updatedUsers);
  };

  const deleteTask = (taskIndex: number, isDone: boolean) => {
    const sourceArray = isDone ? doneTasks : tasks;
    const updatedArray = sourceArray.filter((_, index) => index !== taskIndex);

    const updatedUsers = [...users];
    updatedUsers[activeUserIndex] = {
      ...activeUser,
      [isDone ? "doneTasks" : "tasks"]: updatedArray,
    };

    setUsers(updatedUsers);
  };

  const filteredTasks = (activeUser.tasks || [])
    .filter((task) => {
      if (
        priorityFilter &&
        priorityMap[task.priorities] !== priorityMap[priorityFilter]
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const deadlineA = a.to ? new Date(a.to).getTime() : Infinity;
      const deadlineB = b.to ? new Date(b.to).getTime() : Infinity;

      if (deadlineSortOrder === "newest") return deadlineB - deadlineA;
      if (deadlineSortOrder === "oldest") return deadlineA - deadlineB;

      return 0;
    });

  const filteredDoneTasks = (activeUser.doneTasks || [])
    .filter((task) => {
      if (
        priorityFilter &&
        priorityMap[task.priorities] !== priorityMap[priorityFilter]
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const deadlineA = a.to ? new Date(a.to).getTime() : NaN;
      const deadlineB = b.to ? new Date(b.to).getTime() : NaN;

      if (isNaN(deadlineA) || isNaN(deadlineB)) {
        return 0;
      }

      if (deadlineSortOrder === "newest") return deadlineB - deadlineA;
      if (deadlineSortOrder === "oldest") return deadlineA - deadlineB;

      return 0;
    });

  function closeaddtask() {
    setShowAddTask(false);
  }

  function showTasks() {
    setToDo(true);
    setNotes(false);
  }

  function showNotes() {
    setToDo(false);
    setNotes(true);
  }

  const addNote = () => {
    if (editingIndex !== null) {
      // Update existing note
      const updatedNotes = [...noteList];
      updatedNotes[editingIndex] = newNoteText;
      setNoteList(updatedNotes);
      setEditingIndex(null); // Clear editing state
    } else {
      // Add new note
      setNoteList((prevNotes) => [newNoteText, ...prevNotes]);
    }
    setNewNoteText(""); // Clear the input field
  };

  const editNote = (index: number) => {
    setNewNoteText(noteList[index]); // Set the note text for editing
    setEditingIndex(index); // Set the index to know which note is being edited
  };

  const deleteNote = (index: number) => {
    const updatedNotes = noteList.filter((_, noteIndex) => noteIndex !== index);
    setNoteList(updatedNotes);
  };
  return (
    <div>
      {showAddTask ? (
        <AddTaskForm close={closeaddtask} />
      ) : (
        <div className={styles.mainDiv}>
          <div className={styles.header}>
            <p className={styles.name}>User: {activeUser.name}</p>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Log Out
            </button>
          </div>
          <div className={styles.chose}>
            <p
              onClick={() => showTasks()}
              className={`${todo ? styles.taskp : ""}`}
            >
              Tasks
            </p>
            <p
              onClick={() => showNotes()}
              className={`${notes ? styles.notep : ""}`}
            >
              Notes
            </p>
          </div>
          {notes && (
            <div>
              <div className={styles.addNote}>
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)} // Keep a separate state for the input text
                />
                <button onClick={addNote}>
                  {editingIndex !== null ? "Save Edit" : "Add Note"}
                </button>
              </div>
              {noteList.map((elem, index) => (
                <div key={index} className={styles.note}>
                  <p>{index + 1}</p>
                  <p>{elem}</p>
                  <div className={styles.icons}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 50 50"
                      onClick={() => editNote(index)} // Add edit functionality
                    >
                      <path
                        d="M25 15 L30 10 L35 15 L30 20 Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 50 50"
                      onClick={() => deleteNote(index)}
                    >
                      <line
                        x1="10"
                        y1="10"
                        x2="40"
                        y2="40"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <line
                        x1="10"
                        y1="40"
                        x2="40"
                        y2="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
          {todo && (
            <div>
              <div className={styles.headerDiv}>
                <p>Tasks to do</p>
                <button
                  className={styles.addbutton}
                  onClick={() => setShowAddTask(true)}
                >
                  <img src="/images/plus-icon.jpg" alt="Add Task" /> Add Task
                </button>
              </div>
              <div className={styles.filterControls}>
                <select
                  className={styles.firstFilter}
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="">All Priorities</option>
                  {Object.keys(priorityMap).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>

                {/* New Deadline Filter */}
                <select
                  className={styles.deadline}
                  value={deadlineSortOrder}
                  onChange={(e) =>
                    setDeadlineSortOrder(e.target.value as "newest" | "oldest")
                  }
                >
                  <option value="">No Deadline Filter</option>
                  <option value="newest">Deadline: far from today</option>
                  <option value="oldest">Deadline: close from today</option>
                </select>
              </div>
              <div className={styles.header}>
                <p>#</p>
                <p>Task</p>
                <p>Priorities</p>
                <p>Deadline</p>
              </div>
              <div className={styles.mainContent}>
                {filteredTasks.length === 0 ? (
                  <div>
                    <p>You have no tasks to do</p>
                  </div>
                ) : (
                  filteredTasks.map((item, index) => (
                    <div key={index} className={styles.item}>
                      <p>{index + 1}</p>
                      <p>{item.task}</p>
                      <p>{item.priorities}</p>
                      <p>{`from: ${item.from} to: ${item.to}`}</p>
                      <div className={styles.icons}>
                        <svg
                          onClick={() => moveToDone(index)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="35"
                          height="35"
                          viewBox="0 0 50 50"
                        >
                          <polyline
                            points="12,25 20,32 38,18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                        </svg>
                        <svg
                          onClick={() => deleteTask(index, false)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          viewBox="0 0 50 50"
                        >
                          <line
                            x1="10"
                            y1="10"
                            x2="40"
                            y2="40"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <line
                            x1="10"
                            y1="40"
                            x2="40"
                            y2="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                        </svg>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className={styles.headerDiv}>
                <p>Tasks Done</p>
              </div>
              <div className={styles.mainContent}>
                {filteredDoneTasks.length === 0 ? (
                  <div>
                    <p>You have no tasks done</p>
                  </div>
                ) : (
                  filteredDoneTasks.map((item, index) => (
                    <div key={index} className={styles.item}>
                      <p>{index + 1}</p>
                      <p>{item.task}</p>
                      <p>{item.priorities}</p>
                      <p>{`from: ${item.from} to: ${item.to}`}</p>
                      <div className={styles.icons}>
                        <svg
                          onClick={() => deleteTask(index, true)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          viewBox="0 0 50 50"
                        >
                          <line
                            x1="10"
                            y1="10"
                            x2="40"
                            y2="40"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <line
                            x1="10"
                            y1="40"
                            x2="40"
                            y2="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                        </svg>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
