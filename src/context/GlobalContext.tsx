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

  // Fetch users from JSON file
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/users.json"); // Adjust path as needed
      const data = await response.json();
      setUsers(data);
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
