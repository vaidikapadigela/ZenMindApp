import React, { useEffect, useState } from 'react';
import { FaCheck, FaUndo, FaTrash, FaCalendar } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { calendarService } from '../services/SimplifiedCalendarService';
import "./Todo.css";
import { useTodo } from "./TodoContext";

const Todo = () => {
  const [task, setTask] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("09:00");
  const { tasks, setTasks } = useTodo();
  const [view, setView] = useState("all");
  const [syncStatus, setSyncStatus] = useState('');
  const { user, token } = useAuth();

  // ✅ Setup Axios with Authorization Header
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/todos',
    headers: { Authorization: `Bearer ${token}` },
  });

  // ✅ Fetch all todos from backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axiosInstance.get('/');
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching todos:', err);
      }
    };

    if (token) fetchTodos();
  }, [token]);

  // ✅ Add new todo
  const addTask = async () => {
    if (!task.trim()) {
      alert('Please enter a task');
      return;
    }

    let date = null, time = null;
    if (taskDate) date = taskDate;
    if (taskTime) time = taskTime;

    try {
      // Add to backend
      const res = await axiosInstance.post('/', { text: task, date, time });
      const newTodo = res.data;

      // Google sync (optional)
      if (user?.isGoogleUser && user?.accessToken && date) {
        // ✅ Sync to Google Calendar (if Google user) or fallback for normal users
if (date) {
  setSyncStatus('Syncing to calendar...');
  try {
    const dueDateTime = new Date(`${date}T${time}`);
    let calendarResult;

    if (user?.isGoogleUser && user?.accessToken) {
      // Google user
      calendarResult = await calendarService.addTodo({
        title: task,
        description: "Todo task from ZenMind (Google user)",
        dueDate: dueDateTime,
      });
    } else {
      // Non-Google user fallback
      calendarResult = {
        id: `local-${Date.now()}`,
        link: `mailto:${user?.email || 'user@zenmind.app'}?subject=${encodeURIComponent(task)}&body=Due on ${date} at ${time}`,
      };
    }

    newTodo.calendarEventId = calendarResult.id;
    newTodo.calendarLink = calendarResult.link;
    setSyncStatus('✓ Synced to calendar');
  } catch (error) {
    console.error('Failed to add task to calendar:', error);
    setSyncStatus('⚠️ Calendar sync failed');
  } finally {
    setTimeout(() => setSyncStatus(''), 3000);
  }
}

      }

      setTasks(prev => [newTodo, ...prev]);
      setTask("");
      setTaskDate("");
      setTaskTime("09:00");
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  // ✅ Toggle task completion
  const toggleTaskCompletion = async (id, currentStatus) => {
    try {
      const res = await axiosInstance.put(`/${id}`, { completed: !currentStatus });
      const updatedTodo = res.data;

      setTasks(prev => prev.map(t => (t._id === id ? updatedTodo : t)));

      // Sync update with Google Calendar
      if (user?.isGoogleUser && updatedTodo.calendarEventId) {
        try {
          await calendarService.updateTodo(updatedTodo.calendarEventId, {
            title: `${updatedTodo.completed ? '[DONE] ' : ''}${updatedTodo.text}`,
            description: updatedTodo.completed
              ? "Completed todo from ZenMind"
              : "Todo task from ZenMind",
            dueDate: new Date(`${updatedTodo.date}T${updatedTodo.time}`),
          });
        } catch (error) {
          console.error('Failed to update calendar:', error);
        }
      }
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  // ✅ Delete todo
  const deleteTask = async (id) => {
    try {
      await axiosInstance.delete(`/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));

      // Delete from Google Calendar if exists
      const deletedTask = tasks.find(t => t._id === id);
      if (user?.isGoogleUser && deletedTask?.calendarEventId) {
        try {
          await calendarService.deleteTodo(deletedTask.calendarEventId);
          setSyncStatus('✓ Deleted from calendar');
        } catch (error) {
          console.error('Failed to delete from calendar:', error);
          setSyncStatus('⚠️ Calendar delete failed');
        } finally {
          setTimeout(() => setSyncStatus(''), 3000);
        }
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  // ✅ Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (view === "all") return true;
    if (view === "completed") return t.completed;
    return !t.completed;
  });

  return (
    <div className="todo-wrapper">
      <div className="todo-app">
        <h1>To-Do App</h1>

        {user?.isGoogleUser && (
          <div className="calendar-status-indicator">
            {user.accessToken ? "Calendar sync enabled" : "Calendar sync disabled"}
          </div>
        )}

        <div className="task-input">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task"
          />
          <div className="datetime-inputs">
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
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
          {["all", "completed", "pending"].map(v => (
            <button
              key={v}
              className={view === v ? "active" : ""}
              onClick={() => setView(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)} Tasks
            </button>
          ))}
        </div>

        <ul className="task-list">
          {filteredTasks.length === 0 ? (
            <p>No tasks yet</p>
          ) : (
            filteredTasks.map(t => (
              <li key={t._id} className={t.completed ? "completed" : ""}>
                <div className="task-content">
                  <span>{t.text}</span>
                  
				  {t.calendarLink && (
  <a
    href={t.calendarLink}
    target="_blank"
    rel="noopener noreferrer"
    className="calendar-link"
  >
    {t.date && (
                    <span className="task-date">
                      <FaCalendar /> {t.date} {t.time && `at ${t.time}`}
                    </span>
					
                  )}
  </a>
)}
                </div>
                <div className="task-actions">
                  <button onClick={() => toggleTaskCompletion(t._id, t.completed)}>
                    {t.completed ? <FaUndo /> : <FaCheck />}
                  </button>
                  <button onClick={() => deleteTask(t._id)}>
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Todo;