import React, { createContext, useContext, useState, useEffect } from "react";

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) setTasks(storedTasks);
  }, []);

  // Save whenever tasks change
  useEffect(() => {
    if (tasks.length > 0)
      localStorage.setItem("tasks", JSON.stringify(tasks));
    else
      localStorage.removeItem("tasks");
  }, [tasks]);

  return (
    <TodoContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);
