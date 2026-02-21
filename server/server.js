import dotenv from 'dotenv';
dotenv.config();
console.log("Checking Environment Variable:", process.env.MONGO_URI);
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import Task from './models/task.js';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// Create a task
app.post('/api/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.status(201).json(newTask);
});

// Update task status (Complete/Incomplete)
app.patch('/api/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// Connect to MongoDB & Start
mongoose.connect(process.env.MONGO_URI)
  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running'));