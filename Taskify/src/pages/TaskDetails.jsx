import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { 
  ArrowLeft, Edit, Trash2, Calendar, Plus, Check, X 
} from 'react-feather';
import UserAvatar from '../components/UserAvatar';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTask, currentTask, updateTask, deleteTask, addSubtask, updateSubtask, loading } = useTasks();

  const [newSubtask, setNewSubtask] = useState('');
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      try {
        await fetchTask(id);
      } catch (error) {
        console.error('Error loading task:', error);
        navigate('/');
      }
    };
    loadTask();
  }, [id, fetchTask, navigate]);

  const handleStatusChange = async (e) => {
    try {
      await updateTask(id, { status: e.target.value });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePriorityChange = async (e) => {
    try {
      await updateTask(id, { priority: e.target.value });
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    try {
      await addSubtask(id, newSubtask.trim());
      setNewSubtask('');
      setShowSubtaskInput(false);
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  const handleToggleSubtask = async (subtaskId, completed) => {
    try {
      await updateSubtask(id, subtaskId, !completed);
    } catch (error) {
      console.error('Error updating subtask:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  const isOverdue = () => {
    if (!currentTask?.dueDate || currentTask?.status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(currentTask.dueDate);
    return dueDate < today;
  };

  if (loading || !currentTask) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-t-purple-600 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center mb-6 text-sm font-medium text-gray-600 hover:text-gray-800">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{currentTask.title}</h1>
          <div className="text-sm text-gray-600">Created by {currentTask.creator?.name} on {new Date(currentTask.createdAt).toLocaleDateString()}</div>
        </div>
        <div className="space-x-2">
          <button onClick={() => navigate(`/tasks/${id}/edit`)} className="px-3 py-2 bg-purple-600 text-white rounded-md flex items-center">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </button>
          <button onClick={handleDeleteTask} className="px-3 py-2 bg-red-600 text-white rounded-md flex items-center">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{currentTask.description || 'No description provided'}</p>
          </div>

          <div className="p-6 bg-white rounded shadow">
            <div className="flex justify-between mb-2">
              <h2 className="text-lg font-semibold">Subtasks</h2>
              {!showSubtaskInput && (
                <button onClick={() => setShowSubtaskInput(true)} className="text-purple-600 flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> Add Subtask
                </button>
              )}
            </div>
            {showSubtaskInput && (
              <div className="flex items-center mb-4">
                <input value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubtask(); }}
                  className="flex-1 border px-3 py-2 rounded-l" placeholder="Subtask title" />
                <button onClick={handleAddSubtask} className="bg-purple-600 text-white px-3 py-2">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => { setShowSubtaskInput(false); setNewSubtask(''); }} className="bg-gray-200 px-3 py-2 rounded-r">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <ul className="space-y-2">
              {currentTask.subtasks?.map(subtask => (
                <li key={subtask._id} className="flex items-center">
                  <button onClick={() => handleToggleSubtask(subtask._id, subtask.completed)} className="mr-3">
                    {subtask.completed ? <Check className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 border rounded"></div>}
                  </button>
                  <span className={`${subtask.completed ? 'line-through text-gray-500' : ''}`}>{subtask.title}</span>
                </li>
              )) || <p>No subtasks yet</p>}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white rounded shadow">
            <label className="block mb-2 text-sm font-medium">Status</label>
            <select value={currentTask.status} onChange={handleStatusChange} className="w-full border px-3 py-2 rounded">
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="p-6 bg-white rounded shadow">
            <label className="block mb-2 text-sm font-medium">Priority</label>
            <select value={currentTask.priority} onChange={handlePriorityChange} className="w-full border px-3 py-2 rounded">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className={`p-6 bg-white rounded shadow ${isOverdue() ? 'border-l-4 border-red-500' : ''}`}>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{formatDate(currentTask.dueDate)}</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded shadow">
            <h3 className="text-sm font-medium mb-2">Assignees</h3>
            {currentTask.assignees?.length > 0 ? (
              <div className="space-y-2">
                {currentTask.assignees.map(user => (
                  <div key={user._id} className="flex items-center">
                    <UserAvatar user={user} size="sm" />
                    <span className="ml-2">{user.name}</span>
                  </div>
                ))}
              </div>
            ) : <p>No assignees</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
