import React, { createContext, useState, ReactNode, useEffect } from "react";

// Define types as before
interface Task {
  task: string;
  priorities:
    | "High Priority"
    | "Medium Priority"
    | "Low Priority"
    | "Urgent"
    | "Important"
    | "Critical"
    | "Not Urgent"
    | "Less Important";
  from: string;
  to: string;
}

interface Note {
  note: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  active: boolean;
  tasks: Task[];
  doneTasks: Task[];
  notes: Note[];
}

interface GlobalContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  activeUserId: string | null;
  setActiveUserId: React.Dispatch<React.SetStateAction<string | null>>;
  startArray: Task[];
  setStartArray: React.Dispatch<React.SetStateAction<Task[]>>;
  doingTasksArray: Task[];
  setDoingTasksArray: React.Dispatch<React.SetStateAction<Task[]>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [doingTasksArray, setDoingTasksArray] = useState<Task[]>([]);
  const [startArray, setStartArray] = useState<Task[]>([
    {
      task: "learning",
      priorities: "High Priority",
      from: "1-2-2024",
      to: "1-6-2025",
    },
    {
      task: "music",
      priorities: "Medium Priority",
      from: "1-2-2024",
      to: "2-4-2027",
    },
    {
      task: "exercise",
      priorities: "Low Priority",
      from: "1-2-2014",
      to: "2-4-2029",
    },
    {
      task: "project work",
      priorities: "Critical",
      from: "1-2-2024",
      to: "2-4-2025",
    },
  ]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from JSON file
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/users.json"); // Adjust path as needed
        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(
          "There was a problem loading the user data. Please try again later."
        );
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        users,
        setUsers,
        activeUserId,
        setActiveUserId,
        startArray,
        setStartArray,
        doingTasksArray,
        setDoingTasksArray,
        error,
        setError,
      }}
    >
      {children}
      {error && (
        <div
          style={{
            color: "red",
            position: "fixed",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          {error}
        </div>
      )}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
