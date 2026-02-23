import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Task from './models/task.js';

const app = express();
app.use(express.json());

// Global CORS - Allows your frontend to talk to this backend
app.use(cors({
  origin: true, 
  credentials: true
}));

// Basic route to verify life
app.get('/', (req, res) => res.send("Task Orbit Backend: System Online"));

// API Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Port & DB Start
const PORT = process.env.PORT || 5000;

// Connect with Error Handling to prevent "Status 1" crash
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("❌ Database Connection Failed:", err.message);
    // We don't exit(1) here so the server stays up and you can read the logs!
  });