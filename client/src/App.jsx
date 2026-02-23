import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  // Use the variable we set in the Cloudflare dashboard
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, [API_URL]);

  const addTask = async () => {
    if (!input) return;
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setInput('');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Task Orbit</h1>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="New task..." />
      <button onClick={addTask}>+</button>
      <ul>
        // This prevents the "e.map is not a function" crash
{Array.isArray(tasks) ? (
  tasks.map((task) => (
    <li key={task._id || Math.random()}>{task.text}</li>
  ))
) : (
  <p>Connecting to server...</p>
)}
      </ul>
    </div>
  );
}

export default App;