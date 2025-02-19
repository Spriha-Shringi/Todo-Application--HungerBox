import { useState, useEffect } from 'react';
import { Calendar, Clock, Check, Loader2, Edit, Trash2, X, AlertCircle, CheckCircle2, RotateCcw, AlarmClock, Tag, Search, Filter, SortDesc } from 'lucide-react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/todoApi';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Tasks() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline' or 'status'
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    deadlineTime: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]); 
    }
    const interval = setInterval(checkAndUpdateTasks, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // New function to handle search and filtering
  useEffect(() => {
    let result = [...tasks];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }
    
    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(task => task.status === statusFilter);
    }
    
    // Sorting
    if (sortBy === 'deadline') {
      result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortBy === 'status') {
      const statusOrder = {
        'ACTIVE': 1,
        'IN_PROGRESS': 2,
        'COMPLETE': 4,
        'EXPIRED': 3
      };
      result.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, statusFilter, sortBy]);

  const checkAndUpdateTasks = async () => {
    const now = new Date();
    const updatedTasks = tasks.map(task => {
      const deadline = new Date(task.deadline);
      if (deadline < now && task.status !== 'COMPLETE' && task.status !== 'EXPIRED') {
        return { ...task, status: 'EXPIRED' };
      }
      return task;
    });

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
      checkAndUpdateTasks();
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

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const validateDeadline = (dateStr, timeStr) => {
    if (!dateStr) return false;
    const now = new Date();
    const deadlineDate = new Date(`${dateStr}T${timeStr || '23:59'}:00`);
    return deadlineDate > now;
  };

  const groupTasksByStatus = (taskList) => {
    return {
      ACTIVE: taskList.filter(task => task.status === 'ACTIVE'),
      IN_PROGRESS: taskList.filter(task => task.status === 'IN_PROGRESS'),
      COMPLETE: taskList.filter(task => task.status === 'COMPLETE'),
      EXPIRED: taskList.filter(task => task.status === 'EXPIRED')
    };
  };

  const TaskItem = ({ task }) => {
    const [editedTask, setEditedTask] = useState({
      ...task,
      description: task.description || ''
    });
    const [editError, setEditError] = useState('');
    const isEditing = editingTask === task._id;
    const { date, time } = formatDateTime(task.deadline);
    const timeRemaining = getTimeRemaining(task.deadline);

    const statusStyles = {
      ACTIVE: 'border-blue-500 bg-blue-50',
      IN_PROGRESS: 'border-yellow-500 bg-yellow-50',
      COMPLETE: 'border-green-500 bg-green-50',
      EXPIRED: 'border-red-500 bg-red-50'
    };

    const handleSaveEdit = async () => {
      const datePart = editedTask.deadline.split('T')[0];
      const timePart = editedTask.deadline.split('T')[1].slice(0, 5);
      
      if (!validateDeadline(datePart, timePart)) {
        setEditError('Deadline cannot be in the past');
        return;
      }
      
      setEditError('');
      try {
        await updateTodo(editedTask._id, {
          title: editedTask.title,
          description: editedTask.description,
          deadline: editedTask.deadline,
          status: editedTask.status
        });
        setEditingTask(null);
        fetchTasks();
      } catch (error) {
        console.error("Error updating task:", error);
        setEditError('Failed to update task');
      }
    };

    return (
      <div className={`border-l-4 ${statusStyles[task.status]} bg-white rounded-lg shadow-sm`}>
        <div className="p-6">
          <div className="flex flex-col gap-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <span className={`text-sm font-medium ${task.status === 'EXPIRED' ? 'text-red-600' : 'text-blue-600'} bg-gray-50 px-3 py-1 rounded-full`}>
                    {timeRemaining}
                  </span>
                </div>
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Task title"
                />
                <textarea
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                  className="w-full p-2 border rounded-lg min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Task description"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {date}
                    </label>
                    <input
                      type="date"
                      min={getTodayString()}
                      value={editedTask.deadline.split('T')[0]}
                      onChange={(e) => setEditedTask({
                        ...editedTask, 
                        deadline: `${e.target.value}T${editedTask.deadline.split('T')[1]}`
                      })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {time}
                    </label>
                    <input
                      type="time"
                      value={editedTask.deadline.split('T')[1].slice(0, 5)}
                      onChange={(e) => setEditedTask({
                        ...editedTask, 
                        deadline: `${editedTask.deadline.split('T')[0]}T${e.target.value}:00`
                      })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                {editError && (
                  <div className="text-red-500 flex items-center gap-1.5 text-sm bg-red-50 p-2 rounded-md">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{editError}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 text-sm flex items-center gap-1.5 font-medium"
                  >
                    <Check className="w-4 h-4" /> Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setEditError('');
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 text-sm flex items-center gap-1.5 font-medium"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex justify-end mb-2">
                      <span className={`text-sm font-medium ${task.status === 'EXPIRED' ? 'text-red-600' : 'text-blue-600'} bg-gray-50 px-3 py-1 rounded-full`}>
                        {timeRemaining}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                    {task.description && (
                      <div className="bg-gray-50 p-3 rounded-md text-gray-700 whitespace-pre-wrap mb-3 text-sm border border-gray-100">
                        {task.description}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span>{time}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateTodo(task._id, { status: e.target.value }).then(fetchTasks)}
                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    disabled={task.status === 'EXPIRED'}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETE">Complete</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                  <button 
                    onClick={() => setEditingTask(task._id)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-sm flex items-center gap-1.5 font-medium"
                    disabled={task.status === 'EXPIRED'}
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={() => deleteTodo(task._id).then(fetchTasks)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 text-sm flex items-center gap-1.5 font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </>
            )}
            </div>
        </div>
      </div>
    );
  };

  const StatusSection = ({ title, tasks, icon }) => {
    if (tasks.length === 0) return null;
    
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
          {icon}
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskItem key={task._id} task={task} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Task Management</h1>
              <button 
                onClick={() => {
                  setShowNewTaskForm(!showNewTaskForm);
                  setError('');
                  if (!showNewTaskForm) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const tomorrowString = tomorrow.toISOString().split('T')[0];
                    setNewTask(prev => ({...prev, deadline: tomorrowString}));
                  }
                }}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg shadow hover:bg-blue-50 transition duration-200 font-medium flex items-center gap-2"
              >
                {showNewTaskForm ? <X className="w-5 h-5" /> : <span>+</span>}
                {showNewTaskForm ? 'Cancel' : 'New Task'}
              </button>
            </div>
          </div>

          {/* Search and filter controls */}
          <div className="p-4 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETE">Complete</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <SortDesc className="w-5 h-5 text-gray-400" />
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="deadline">Sort by Deadline</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {showNewTaskForm && (
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-indigo-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Create New Task
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="Enter task title"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      placeholder="Enter task description"
                      rows="3"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        min={getTodayString()}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={newTask.deadlineTime}
                        onChange={(e) => setNewTask({...newTask, deadlineTime: e.target.value})}
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="text-red-500 flex items-center gap-1.5 text-sm bg-red-50 p-3 rounded-md">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (!newTask.title.trim()) {
                        setError('Title is required');
                        return;
                      }
                      if (!newTask.description.trim()) {
                        setError('Description is required');
                        return;
                      }
                      if (!newTask.deadline) {
                        setError('Deadline date is required');
                        return;
                      }
                      
                      const timeStr = newTask.deadlineTime || '23:59';
                      
                      if (!validateDeadline(newTask.deadline, timeStr)) {
                        setError('Deadline cannot be in the past');
                        return;
                      }
                      
                      const deadline = `${newTask.deadline}T${timeStr}:00`;
                      
                      createTodo({
                        title: newTask.title,
                        description: newTask.description,
                        status: 'ACTIVE',
                        deadline
                      }).then(() => {
                        setNewTask({
                          title: '',
                          description: '',
                          deadline: '',
                          deadlineTime: ''
                        });
                        setShowNewTaskForm(false);
                        setError('');
                        fetchTasks();
                      }).catch(err => {
                        console.error("Error creating task:", err);
                        setError('Failed to create task');
                      });
                    }}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-200 font-medium shadow-sm"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto mb-4" />
                  <p className="text-gray-500">Loading your tasks...</p>
                </div>
              </div>
            ) : (
              <>
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {tasks.length === 0 ? "No tasks yet" : "No matching tasks found"}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {tasks.length === 0 
                        ? "Create your first task by clicking the \"New Task\" button to get started organizing your workload."
                        : "Try adjusting your search or filter criteria to find what you're looking for."}
                    </p>
                  </div>
                ) : (
                  <div>
                    <StatusSection 
                      title="Active Tasks" 
                      tasks={groupTasksByStatus(filteredTasks).ACTIVE}
                      icon={<Tag className="w-5 h-5" />}
                    />
                    <StatusSection 
                      title="In Progress" 
                      tasks={groupTasksByStatus(filteredTasks).IN_PROGRESS}
                      icon={<RotateCcw className="w-5 h-5" />}
                    />
                    <StatusSection 
                      title="Completed" 
                      tasks={groupTasksByStatus(filteredTasks).COMPLETE}
                      icon={<CheckCircle2 className="w-5 h-5" />}
                    />
                    <StatusSection 
                      title="Expired" 
                      tasks={groupTasksByStatus(filteredTasks).EXPIRED}
                      icon={<AlarmClock className="w-5 h-5" />}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}