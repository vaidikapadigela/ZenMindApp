import React, { useEffect, useState } from 'react';
import { FaCheck, FaUndo, FaTrash, FaCalendar } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { calendarService } from '../services/SimplifiedCalendarService';
import { useTodo } from './TodoContext';
import axios from 'axios';
import "./Todo.css";

const Todo = () => {
  const [task, setTask] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("09:00");
  const [view, setView] = useState("all");
  const [syncStatus, setSyncStatus] = useState('');
  const { user } = useAuth();
  const { tasks, setTasks } = useTodo();

  const token = localStorage.getItem("token");

  // 🟢 Fetch tasks (backend or localStorage)
  useEffect(() => {
    const fetchTasks = async () => {
      if (user?.isGoogleUser) {
        const storedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (storedTasks) setTasks(storedTasks);
      } else if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/todos", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTasks(res.data);
        } catch (error) {
          console.error("Failed to fetch tasks:", error);
        }
      }
    };
    fetchTasks();
  }, [user]);

  // 🟢 Save to localStorage (Google users)
  useEffect(() => {
    if (user?.isGoogleUser) {
      if (tasks.length > 0) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
      } else {
        localStorage.removeItem("tasks");
      }
    }
  }, [tasks, user]);

  // 🟢 Add Task
  const addTask = async () => {
    if (!task.trim()) {
      alert("Please enter a task");
      return;
    }

    const newTask = {
      text: task,
      completed: false,
      date: taskDate || null,
      time: taskTime || null,
    };

    // Google user → Sync to Google Calendar
    if (user?.isGoogleUser && user?.accessToken && taskDate) {
      const dueDateTime = new Date(`${taskDate}T${taskTime}`);
      if (isNaN(dueDateTime.getTime())) {
        alert("Invalid date/time selected.");
        return;
      }

      try {
        setSyncStatus("Syncing to Google Calendar...");
        const calendarResult = await calendarService.addTodo({
          title: task,
          description: "Todo from ZenMind",
          dueDate: dueDateTime,
        });

        newTask.dueDateTime = dueDateTime.toISOString();
        newTask.calendarEventId = calendarResult.id;
        newTask.calendarLink = calendarResult.link;
        setSyncStatus("✓ Synced to Google Calendar");
      } catch (error) {
        console.error("Calendar sync failed:", error);
        setSyncStatus("⚠️ Calendar sync failed (saved locally)");
      } finally {
        setTimeout(() => setSyncStatus(""), 3000);
      }

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }

    // Normal user → Save to backend
    else if (token) {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/todos",
          newTask,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks([...tasks, res.data]);
      } catch (error) {
        console.error("Failed to save to DB:", error);
        alert("Failed to save task. Please try again.");
      }
    }

    setTask("");
    setTaskDate("");
    setTaskTime("09:00");
  };

  // 🟢 Toggle Complete
  const toggleTaskCompletion = async (index) => {
    const updatedTasks = [...tasks];
    const taskItem = updatedTasks[index];
    taskItem.completed = !taskItem.completed;

    // Update backend
    if (token && !user?.isGoogleUser && taskItem._id) {
      try {
        await axios.put(
          `http://localhost:5000/api/todos/${taskItem._id}`,
          { completed: taskItem.completed },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Failed to update DB:", error);
      }
    }

    // Update Google Calendar
    if (user?.isGoogleUser && user?.accessToken && taskItem.calendarEventId) {
      try {
        await calendarService.updateTodo(taskItem.calendarEventId, {
          title: `${taskItem.completed ? '[DONE] ' : ''}${taskItem.text}`,
          description: taskItem.completed
            ? "Completed todo from ZenMind"
            : "Todo from ZenMind",
          dueDate: new Date(taskItem.dueDateTime),
        });
      } catch (error) {
        console.error("Calendar update failed:", error);
      }
    }

    setTasks(updatedTasks);
  };

  // 🟢 Delete Task
  const deleteTask = async (index) => {
    const taskItem = tasks[index];

    // Delete from DB
    if (token && !user?.isGoogleUser && taskItem._id) {
      try {
        await axios.delete(`http://localhost:5000/api/todos/${taskItem._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Failed to delete from DB:", error);
      }
    }

    // Delete from Google Calendar
    if (user?.isGoogleUser && user?.accessToken && taskItem.calendarEventId) {
      try {
        setSyncStatus("Deleting from Google Calendar...");
        await calendarService.deleteTodo(taskItem.calendarEventId);
        setSyncStatus("✓ Deleted from calendar");
      } catch (error) {
        console.error("Calendar delete failed:", error);
        setSyncStatus("⚠️ Calendar delete failed");
      } finally {
        setTimeout(() => setSyncStatus(""), 3000);
      }
    }

    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // 🟢 Filter Tasks
  const filteredTasks = tasks.filter((t) =>
    view === "all" ? true : view === "completed" ? t.completed : !t.completed
  );

  return (
    <div className="todo-wrapper">
      <div className="todo-app">
        <h1>To-Do App</h1>

        {user?.isGoogleUser && (
          <div className="calendar-status-indicator">
            Calendar sync enabled
          </div>
        )}

        <div className="task-input">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task"
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <div className="datetime-inputs">
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
            <input
              type="time"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
            />
          </div>
          <button onClick={addTask}>Add Task</button>
        </div>

        {syncStatus && <div className="sync-status">{syncStatus}</div>}

        <div className="view-toggle">
          <button
            onClick={() => setView("all")}
            className={view === "all" ? "active" : ""}
          >
            All
          </button>
          <button
            onClick={() => setView("completed")}
            className={view === "completed" ? "active" : ""}
          >
            Completed
          </button>
          <button
            onClick={() => setView("pending")}
            className={view === "pending" ? "active" : ""}
          >
            Pending
          </button>
        </div>

        <ul className="task-list">
          {filteredTasks.map((taskItem, index) => (
            <li key={index} className={taskItem.completed ? "completed" : ""}>
              <span>{taskItem.text}</span>
              {taskItem.date && (
                <span className="task-date">
                  <FaCalendar /> {taskItem.date} {taskItem.time}
                </span>
              )}
              <div className="task-actions">
                <button onClick={() => toggleTaskCompletion(index)}>
                  {taskItem.completed ? <FaUndo /> : <FaCheck />}
                </button>
                <button onClick={() => deleteTask(index)}>
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;