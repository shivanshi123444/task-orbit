import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Task from './models/task.js';

const app = express();
app.use(express.json());

// ALLOWS ANY FRONTEND: Perfect for a fresh start
app.use(cors({
  origin: true, 
  credentials: true
}));

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

// Database Connection
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected successfully');
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server active on port ${PORT}`));
  })
  .catch(err => {
    console.error("❌ DB Error:", err);
    process.exit(1); // Prevents "Status 1" crash by exiting cleanly
  });