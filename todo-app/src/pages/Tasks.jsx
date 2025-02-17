import { useState } from 'react';

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Learn React', status: 'ACTIVE', deadline: '2025-02-20' },
    { id: 2, title: 'Build TODO App', status: 'IN_PROGRESS', deadline: '2025-02-21' },
  ]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Your Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="border p-2 mb-2">
            <span className="font-semibold">{task.title}</span> - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
