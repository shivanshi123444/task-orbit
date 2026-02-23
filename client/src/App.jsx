import { useState, useEffect } from 'react';
import axios from 'axios';

// Dynamically picks the URL from Cloudflare/Vercel settings
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(API_URL);
        setTasks(res.data);
      } catch (err) {
        console.error("Connection to backend failed:", err);
      }
    };
    fetchTasks();
  }, []);

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

  // ... (rest of your toggle and delete functions)

  return (
    <div className="app">
      <h1>Task Orbit</h1>
      <form onSubmit={addTask}>
        <input value={newTask} onChange={(e) => setNewTask(e.target.value)} />
        <button type="submit">+</button>
      </form>
      {/* ... Task List Mapping ... */}
    </div>
  );
}

export default App;