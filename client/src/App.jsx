import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, CheckCircle, Circle, Loader2, Rocket } from 'lucide-react';

// This tells the app to use the live Render link, or localhost if testing locally
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch all tasks from MongoDB
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const res = await axios.post(API_URL, { text: input });
      setTasks([res.data, ...tasks]); // Add new task to the top of the list
      setInput('');
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // 3. Toggle completion status
  const toggleTask = async (id) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`);
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  // 4. Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-6">
      <div className="max-w-xl mx-auto mt-10">
        
        {/* Header Section */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Task <span className="text-blue-500">Orbit</span>
          </h1>
          <p className="text-slate-400 mt-2">Manage your daily missions</p>
        </header>

        {/* Input Form */}
        <form onSubmit={addTask} className="flex gap-3 mb-8">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-800/50 border border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
            placeholder="Add a new mission..."
          />
          <button className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors shadow-lg shadow-blue-900/20">
            <Plus size={24} />
          </button>
        </form>

        {/* Main Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500 mb-2" size={40} />
            <p className="text-slate-500">Scanning Orbit...</p>
          </div>
        ) : (
          <>
            {/* BONUS CHALLENGE: Empty State */}
            {tasks.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-700">
                <div className="flex justify-center mb-4">
                  <Rocket className="text-slate-600 animate-bounce" size={48} />
                </div>
                <h3 className="text-xl font-semibold text-slate-300">No missions in orbit</h3>
                <p className="text-slate-500 mt-2">Your dashboard is clear. Launch a new task to get started!</p>
              </div>
            ) : (
              /* Task List */
              <ul className="space-y-3">
                {tasks.map(task => (
                  <li key={task._id} className="group bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex justify-between items-center hover:bg-slate-800 transition-all">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleTask(task._id)} className="transition-transform active:scale-90">
                        {task.completed ? (
                          <CheckCircle className="text-green-500" fill="currentColor" fillOpacity="0.2" />
                        ) : (
                          <Circle className="text-slate-500" />
                        )}
                      </button>
                      <span className={`text-lg transition-all ${task.completed ? 'line-through text-slate-500 italic' : 'text-slate-200'}`}>
                        {task.text}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTask(task._id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition-all p-2 rounded-lg hover:bg-red-500/10"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;