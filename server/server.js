import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Task from './models/task.js';

const app = express();
app.use(express.json());

// Global CORS - Essential for Task Orbit to talk across domains
app.use(cors({
  origin: true, 
  credentials: true
}));

// Basic route to verify the server is live
app.get('/', (req, res) => res.send("Task Orbit Backend: System Online"));

// API Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) { 
    res.status(400).json({ error: err.message }); 
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Port & DB Start - Render requires 0.0.0.0 binding and port 10000
const PORT = process.env.PORT || 10000; 

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected successfully');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server active on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Database Connection Failed:", err.message);
  });