const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middleware
app.use(express.json());
app.use(cors()); // Allows your Cloudflare frontend to talk to this backend

// 2. MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ Connection Error:', err));

// 3. Task Schema
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});
const Task = mongoose.model('Task', taskSchema);

// 4. API Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks); // ✅ This sends an array [] which .map needs
  } catch (err) {
    res.status(500).json([]); // ✅ Even if it fails, send an empty array [] to prevent frontend crash
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask); // ✅ Send back the saved task
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to save task" });
  }
});
// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));