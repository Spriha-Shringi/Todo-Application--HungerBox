import { useState, useEffect } from 'react';
import { Calendar, Clock, Check, Loader2, Edit, Trash2, X } from 'lucide-react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/todoApi';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    // description: '',
    deadline: '',
    deadlineTime: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // const deltry=({task}){
    
  // }

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(checkAndUpdateTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkAndUpdateTasks = async () => {
    const now = new Date();
    const updatedTasks = tasks.map(task => {
      const deadline = new Date(task.deadline);
      if (deadline < now && task.status !== 'COMPLETE' && task.status !== 'EXPIRED') {
        return { ...task, status: 'EXPIRED' };
      }
      return task;
    });

    // Update expired tasks in bulk
    const expiredTasks = updatedTasks.filter(
      task => task.status === 'EXPIRED' && 
      tasks.find(t => t.id === task._id)?.status !== 'EXPIRED'
    );

    if (expiredTasks.length > 0) {
      await Promise.all(expiredTasks.map(task => 
        updateTodo(task._id, { status: 'EXPIRED' })
      ));
      setTasks(updatedTasks);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTodos();
      setTasks(data);
      // console.log("data length " + data.length);
      // data.map((task) => (
      //   // key={task._id} task={task} 
      //   console.log(task.title +"the id is" + task._id)
      // ))
      checkAndUpdateTasks(); // Check for expired tasks immediately after fetching
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      })
    };
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;

    if (diff < 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} days ${hours} hours remaining`;
    if (hours > 0) return `${hours} hours ${minutes} minutes remaining`;
    return `${minutes} minutes remaining`;
  };

  const TaskItem = ({ task }) => {
    const [editedTask, setEditedTask] = useState(task);
    const isEditing = editingTask === task._id;
    const { date, time } = formatDateTime(task.deadline);
    const timeRemaining = getTimeRemaining(task.deadline);

    const statusStyles = {
      ACTIVE: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETE: 'bg-green-100 text-green-800',
      EXPIRED: 'bg-red-100 text-red-800'
    };

    return (
      <div className={`bg-white border rounded-lg shadow-sm transition-all duration-200 ${task.status === 'EXPIRED' ? 'border-red-200' : 'hover:shadow-md'}`}>
        <div className="p-6">
          <div className="flex flex-col gap-4">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Task title"
                />
                {/* <textarea
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                  className="w-full p-2 border rounded-lg min-h-[100px]"
                  placeholder="Task description"
                /> */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={editedTask.deadline.split('T')[0]}
                    onChange={(e) => setEditedTask({
                      ...editedTask, 
                      deadline: `${e.target.value}T${editedTask.deadline.split('T')[1]}`
                    })}
                    className="p-2 border rounded-lg"
                  />
                  <input
                    type="time"
                    value={editedTask.deadline.split('T')[1].slice(0, 5)}
                    onChange={(e) => setEditedTask({
                      ...editedTask, 
                      deadline: `${editedTask.deadline.split('T')[0]}T${e.target.value}:00`
                    })}
                    className="p-2 border rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                    {/* <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p> */}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[task.status]}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{time}</span>
                  </div>
                  <span className={`text-sm font-medium ${task.status === 'EXPIRED' ? 'text-red-600' : 'text-blue-600'}`}>
                    {timeRemaining}
                  </span>
                </div>
              </>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {isEditing ? (
                <>
             <button
  onClick={() => {
    console.log("Before update:", editedTask); // ✅ Debugging log
    if (!editedTask._id) {
      console.error("Task ID is missing, cannot update!");
      return;
    }

    updateTodo(editedTask._id, {
      title: editedTask.title,
      description: editedTask.description,
      deadline: editedTask.deadline,
      status: editedTask.status
    }).then(() => {
      console.log("Task updated successfully"); // ✅ Debugging log
      setEditingTask(null);
      fetchTasks(); // Ensure tasks reload after update
    }).catch(error => console.error("Error updating task:", error));
  }}
  className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 text-sm flex items-center gap-1"
>
  <Check className="w-4 h-4" /> Save
</button>


                  <button
                    onClick={() => setEditingTask(null)}
                    className="px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 text-sm flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <select
                    value={task.status}
                    onChange={(e) => updateTodo(task._id, { status: e.target.value }).then(fetchTasks)}
                    className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    disabled={task.status === 'EXPIRED'}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETE">Complete</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                  <button 
                    onClick={() => setEditingTask(task._id)}
                    className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200 text-sm flex items-center gap-1"
                    disabled={task.status === 'EXPIRED'}
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={() => deleteTodo(task._id).then(fetchTasks)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Task Management</h1>
              <button 
                onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg shadow hover:bg-blue-50 transition duration-200 font-medium"
              >
                {showNewTaskForm ? 'Cancel' : '+ New Task'}
              </button>
            </div>
          </div>

          <div className="p-6">
            {showNewTaskForm && (
              <div className="mb-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Create New Task</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="Enter task title"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                  </div>
                  <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      placeholder="Enter task description"
                      rows="3"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    /> */}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={newTask.deadlineTime}
                        onChange={(e) => setNewTask({...newTask, deadlineTime: e.target.value})}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (newTask.title.trim()) {
                        const deadline = `${newTask.deadline}T${newTask.deadlineTime || '23:59'}:00`;
                        createTodo({
                          title: newTask.title,
                          // description: newTask.description,
                          status: 'ACTIVE',
                          deadline
                        }).then(() => {
                          setNewTask({
                            title: '',
                            // description: '',
                            deadline: '',
                            deadlineTime: ''
                          });
                          setShowNewTaskForm(false);
                          fetchTasks();
                        });
                      }
                    }}
                    disabled={!newTask.title.trim()}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No tasks yet. Create a new task to get started!
                  </div>
                ) : (
                  // console.log("the id is" + tasks.id)
                  tasks.map((task) => (
                    <TaskItem key={task._id} task={task} />
                    // console.log("the id is" + task._id)
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}