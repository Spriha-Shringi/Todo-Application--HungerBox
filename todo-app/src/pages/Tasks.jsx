import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/todoApi';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const data = await getTodos();
    setTasks(data);
  };

  const handleAddTask = async () => {
    if (newTask.trim()) {
      await createTodo({ title: newTask, status: 'ACTIVE', deadline: '2025-02-20' });
      setNewTask('');
      fetchTasks();
    }
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    fetchTasks();
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Your Tasks</h2>
      <input
        className="w-full p-2 border rounded mb-2"
        type="text"
        placeholder="New Task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button className="w-full bg-blue-500 text-white p-2 rounded mb-4" onClick={handleAddTask}>
        Add Task
      </button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="border p-2 mb-2 flex justify-between">
            <span className="font-semibold">{task.title}</span> - {task.status}
            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}