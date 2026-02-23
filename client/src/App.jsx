import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Dynamically reads the URL from Cloudflare/Vercel settings
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Connection to backend failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(API_URL, { text: newTask, completed: false });
      setTasks([res.data, ...tasks]);
      setNewTask('');
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`);
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="app-container">
      <h1>Task Orbit</h1>
      <form onSubmit={addTask}>
        <input 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="New mission..."
        />
        <button type="submit">+</button>
      </form>

      {loading ? <p>Waking up server...</p> : (
        <div className="task-list">
          {tasks.map(task => (
            <div key={task._id} className={`task-item ${task.completed ? 'done' : ''}`}>
              <span onClick={() => toggleComplete(task._id)}>{task.text}</span>
              <button onClick={() => deleteTask(task._id)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;