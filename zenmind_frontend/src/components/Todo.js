import React, { useEffect, useState } from 'react'; // Add useEffect and useState
import { FaCheck, FaUndo, FaTrash } from 'react-icons/fa'; // Add icons import

import "./Todo.css"; 
const Todo = () => {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [view, setView] = useState("all"); // "all", "completed", or "pending"
  
    // Fetch tasks from localStorage when the app loads
    useEffect(() => {
      const storedTasks = JSON.parse(localStorage.getItem("tasks"));
      if (storedTasks) {
        setTasks(storedTasks);
      }
    }, []);
  
    // Save tasks to localStorage whenever the tasks state changes
    useEffect(() => {
      if (tasks.length > 0) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }
    }, [tasks]);
  
    // Handle input changes
    const handleInputChange = (e) => {
      setTask(e.target.value);
    };
  
    // Handle adding a new task
    const addTask = () => {
      if (task.trim()) {
        const newTask = { text: task, completed: false };
        setTasks([...tasks, newTask]);
        setTask("");
      }
    };
  
    // Handle completing a task
    const toggleTaskCompletion = (index) => {
      const updatedTasks = [...tasks];
      updatedTasks[index].completed = !updatedTasks[index].completed;
      setTasks(updatedTasks);
    };
  
    // Handle deleting a task
    const deleteTask = (index) => {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    };
  
    // Filter tasks based on the view
    const filteredTasks =
      view === "all"
        ? tasks
        : view === "completed"
        ? tasks.filter((task) => task.completed)
        : tasks.filter((task) => !task.completed);
  
    return (
      <div className="todo-wrapper">
      <div className="todo-app">
        <h1>To-Do App</h1>
  
        {/* Task input */}
        <div className="task-input">
          <input
            type="text"
            value={task}
            onChange={handleInputChange}
            placeholder="Enter a task"
          />
          <button onClick={addTask}>Add Task</button>
        </div>
  
        {/* View Toggle Buttons */}
        <div className="view-toggle">
          <button
            onClick={() => setView("all")}
            className={view === "all" ? "active" : ""}
          >
            All Tasks
          </button>
          <button
            onClick={() => setView("completed")}
            className={view === "completed" ? "active" : ""}
          >
            Completed Tasks
          </button>
          <button
            onClick={() => setView("pending")}
            className={view === "pending" ? "active" : ""}
          >
            Pending Tasks
          </button>
        </div>
  
        {/* Task List */}
        <div className="task-list-container">
          <h2>
            {view === "all"
              ? "All Tasks"
              : view === "completed"
              ? "Completed Tasks"
              : "Pending Tasks"}
          </h2>
          <ul className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-message">
                <p>No tasks to display</p>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <li key={index} className={task.completed ? "completed" : ""}>
                  <span>{task.text}</span>
                  <div>
                    <button onClick={() => toggleTaskCompletion(index)}>
                      {!task.completed ? (
                        <FaCheck className="complete-icon" />
                      ) : (
                        <FaUndo className="undo-icon" />
                      )}
                    </button>
                    <button onClick={() => deleteTask(index)}>
                      <FaTrash className="delete-icon" />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      </div>
    );
  };

export default Todo;
