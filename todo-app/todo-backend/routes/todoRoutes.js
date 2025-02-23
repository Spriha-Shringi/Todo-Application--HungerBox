const express = require('express');
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).sort({ deadline: 1 });
  res.json(todos);
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, description, deadline } = req.body;
  const todo = new Todo({ title, description, deadline, user: req.user.id });
  await todo.save();
  res.status(201).json(todo);
});

router.put('/:id', authMiddleware, async (req, res) => {
  console.log("🔹 Received Update Request");
  console.log("Task ID:", req.params.id);
  console.log("Updated Data:", req.body);

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true } 
    );

    if (!updatedTodo) {
      console.error("Task not found in DB!");
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log("Updated Task:", updatedTodo);
    res.json(updatedTodo);
  } catch (error) {
    console.error(" Error updating task:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Todo deleted' });
});

module.exports = router;
