import React, { useEffect, useState } from 'react';
import { FaCheck, FaUndo, FaTrash, FaCalendar } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { calendarService } from '../services/SimplifiedCalendarService';
import "./Todo.css";

const Todo = () => {
	const [task, setTask] = useState("");
	const [taskDate, setTaskDate] = useState("");
	const [taskTime, setTaskTime] = useState("09:00");
	const [tasks, setTasks] = useState([]);
	const [view, setView] = useState("all");
	const [syncStatus, setSyncStatus] = useState('');
	const { user } = useAuth();

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
		} else {
			localStorage.removeItem("tasks");
		}
	}, [tasks]);

	// Handle input changes
	const handleInputChange = (e) => {
		setTask(e.target.value);
	};

	// Handle adding a new task
	const addTask = async () => {
		if (!task.trim()) {
			alert('Please enter a task');
			return;
		}

		const newTask = {
			text: task,
			completed: false,
			addedDate: new Date().toISOString()
		};

		// Add date/time if provided
		if (taskDate) {
			const dueDateTime = new Date(`${taskDate}T${taskTime}`);
			
			// Validate the date
			if (isNaN(dueDateTime.getTime())) {
				alert('Invalid date/time selected. Please try again.');
				return;
			}

			newTask.dueDate = taskDate;
			newTask.dueTime = taskTime;
			newTask.dueDateTime = dueDateTime.toISOString();

			// Try to add to Google Calendar if user is logged in with Google
			if (user?.isGoogleUser && user?.accessToken) {
				setSyncStatus('Syncing to calendar...');
				try {
					const calendarResult = await calendarService.addTodo({
						title: task,
						description: "Todo task from ZenMind",
						dueDate: dueDateTime
					});
					
					newTask.calendarEventId = calendarResult.id;
					newTask.calendarLink = calendarResult.link;
					setSyncStatus('✓ Synced to Google Calendar');
					
					setTimeout(() => setSyncStatus(''), 3000);
				} catch (error) {
					console.error('Failed to add task to calendar:', error);
					setSyncStatus('⚠️ Calendar sync failed (saved locally)');
					setTimeout(() => setSyncStatus(''), 5000);
				}
			}
		}

		// Add task to list
		setTasks([...tasks, newTask]);
		setTask("");
		setTaskDate("");
		setTaskTime("09:00");
	};

	// Handle completing a task
	const toggleTaskCompletion = async (index) => {
		const updatedTasks = [...tasks];
		const taskItem = updatedTasks[index];
		taskItem.completed = !taskItem.completed;

		// Update calendar event if exists
		if (user?.isGoogleUser && user?.accessToken && taskItem.calendarEventId && taskItem.dueDateTime) {
			try {
				await calendarService.updateTodo(taskItem.calendarEventId, {
					title: `${taskItem.completed ? '[DONE] ' : ''}${taskItem.text}`,
					description: taskItem.completed ? "Completed todo from ZenMind" : "Todo task from ZenMind",
					dueDate: new Date(taskItem.dueDateTime)
				});
			} catch (error) {
				console.error('Failed to update task in calendar:', error);
			}
		}

		setTasks(updatedTasks);
	};

	// Handle deleting a task
	const deleteTask = async (index) => {
		const taskItem = tasks[index];
		
		// Delete from calendar if exists
		if (user?.isGoogleUser && user?.accessToken && taskItem.calendarEventId) {
			setSyncStatus('Deleting from calendar...');
			try {
				await calendarService.deleteTodo(taskItem.calendarEventId);
				setSyncStatus('✓ Deleted from calendar');
				setTimeout(() => setSyncStatus(''), 3000);
			} catch (error) {
				console.error('Failed to delete task from calendar:', error);
				setSyncStatus('⚠️ Calendar delete failed');
				setTimeout(() => setSyncStatus(''), 3000);
			}
		}

		const updatedTasks = tasks.filter((_, i) => i !== index);
		setTasks(updatedTasks);
	};

	// Filter and sort tasks
	const filteredTasks = tasks
		.filter(taskItem => {
			if (view === "all") return true;
			if (view === "completed") return taskItem.completed;
			return !taskItem.completed;
		})
		.sort((a, b) => {
			if (a.dueDateTime && b.dueDateTime) {
				return new Date(a.dueDateTime) - new Date(b.dueDateTime);
			}
			if (a.dueDateTime) return -1;
			if (b.dueDateTime) return 1;
			if (a.completed !== b.completed) return a.completed ? 1 : -1;
			return new Date(b.addedDate) - new Date(a.addedDate);
		});

	return (
		<div className="todo-wrapper">
			<div className="todo-app">
				<h1>To-Do App</h1>

				{/* Calendar sync status indicator */}
				{user?.isGoogleUser && user?.accessToken && (
					<div className="calendar-status-indicator">
						Calendar sync enabled
					</div>
				)}

				{user?.isGoogleUser && !user?.accessToken && (
					<div className="calendar-warning">
					Calendar sync disabled. Login with gmail to enable Google Calendar sync.
					</div>
				)}

				{/* Task input */}
				<div className="task-input">
					<input
						type="text"
						value={task}
						onChange={handleInputChange}
						placeholder="Enter a task"
						onKeyPress={(e) => e.key === 'Enter' && addTask()}
					/>
					<div className="datetime-inputs">
						<input
							type="date"
							value={taskDate}
							onChange={(e) => setTaskDate(e.target.value)}
							min={new Date().toISOString().split('T')[0]}
						/>
						<input
							type="time"
							value={taskTime}
							onChange={(e) => setTaskTime(e.target.value)}
						/>
					</div>
					<button onClick={addTask}>Add Task</button>
				</div>

				{/* Sync status message */}
				{syncStatus && (
					<div className={`sync-status ${syncStatus.includes('✓') ? 'success' : syncStatus.includes('⚠️') ? 'warning' : 'info'}`}>
						{syncStatus}
					</div>
				)}

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
							filteredTasks.map((taskItem, index) => {
								const originalIndex = tasks.findIndex(t => t === taskItem);
								return (
									<li key={originalIndex} className={taskItem.completed ? "completed" : ""}>
										<div className="task-content">
											<span className="task-text">{taskItem.text}</span>
											{taskItem.dueDateTime && (
												<span className="task-date">
													<FaCalendar /> 
													{taskItem.calendarLink ? (
														<a 
															href={taskItem.calendarLink} 
															target="_blank" 
															rel="noopener noreferrer"
															title="Open in Google Calendar"
														>
															{new Date(taskItem.dueDateTime).toLocaleString('en-US', {
																weekday: 'short',
																month: 'short',
																day: 'numeric',
																hour: 'numeric',
																minute: '2-digit'
															})}
														</a>
													) : (
														<span>
															{new Date(taskItem.dueDateTime).toLocaleString('en-US', {
																weekday: 'short',
																month: 'short',
																day: 'numeric',
																hour: 'numeric',
																minute: '2-digit'
															})}
														</span>
													)}
												</span>
											)}
										</div>
										<div className="task-actions">
											<button 
												onClick={() => toggleTaskCompletion(originalIndex)}
												title={taskItem.completed ? "Mark as pending" : "Mark as completed"}
											>
												{!taskItem.completed ? (
													<FaCheck className="complete-icon" />
												) : (
													<FaUndo className="undo-icon" />
												)}
											</button>
											<button 
												onClick={() => deleteTask(originalIndex)}
												title="Delete task"
											>
												<FaTrash className="delete-icon" />
											</button>
										</div>
									</li>
								);
							})
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Todo;