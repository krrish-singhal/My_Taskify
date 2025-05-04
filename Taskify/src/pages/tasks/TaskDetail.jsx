import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTask } from "../../contexts/TaskContext";
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Star, CheckCircle, Circle, AlertTriangle, Plus, X } from 'lucide-react';
import UserAvatar from "../../components/UserAvatar";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTask, updateTask, deleteTask, addSubtask, updateSubtask, toggleImportant, loading } = useTask();
  
  const [task, setTask] = useState(null);
  const [newSubtask, setNewSubtask] = useState("");
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const taskData = await fetchTask(id);
      setTask(taskData);
    } catch (error) {
      console.error("Error loading task:", error);
      navigate("/tasks");
    }
  };

  const handleStatusChange = async (e) => {
    try {
      const updatedTask = await updateTask(id, { 
        completed: e.target.value === "completed",
        completedAt: e.target.value === "completed" ? new Date() : null
      });
      setTask(updatedTask);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePriorityChange = async (e) => {
    try {
      const updatedTask = await updateTask(id, { priority: e.target.value });
      setTask(updatedTask);
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  const handleToggleImportant = async () => {
    try {
      const isImportant = task.tags && task.tags.includes("important");
      const updatedTask = await toggleImportant(id, !isImportant);
      setTask(updatedTask);
    } catch (error) {
      console.error("Error toggling importance:", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(id);
      navigate("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    
    try {
      const updatedTask = await addSubtask(id, { title: newSubtask.trim() });
      setTask(updatedTask);
      setNewSubtask("");
      setShowSubtaskInput(false);
    } catch (error) {
      console.error("Error adding subtask:", error);
    }
  };

  const handleToggleSubtask = async (subtaskId, completed) => {
    try {
      const updatedTask = await updateSubtask(id, subtaskId, { completed: !completed });
      setTask(updatedTask);
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!task?.dueDate || task?.completed) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };

  // Check if task is due today
  const isDueToday = () => {
    if (!task?.dueDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate.getTime() === today.getTime();
  };

  // Check if task is important
  const isImportant = () => {
    return task?.tags && task.tags.includes("important");
  };

  if (loading || !task) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Task Details</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Created on {formatDate(task.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {task.title}
              </h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleImportant}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label={isImportant() ? "Remove from important" : "Mark as important"}
                >
                  <Star 
                    className={`w-5 h-5 ${
                      isImportant() 
                        ? "text-yellow-500 fill-yellow-500" 
                        : "text-gray-400 hover:text-yellow-500"
                    }`} 
                  />
                </button>
                <Link
                  to={`/tasks/${id}/edit`}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Edit task"
                >
                  <Edit className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </Link>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {task.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {task.description}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {task.priority && (
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  task.priority === "high" 
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                    : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </span>
              )}

              {task.tags && task.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full dark:bg-purple-900/30 dark:text-purple-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Due date */}
            {task.dueDate && (
              <div className={`mb-6 p-3 rounded-lg ${
                isOverdue() 
                  ? "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900/50" 
                  : isDueToday()
                    ? "bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:border-purple-900/50"
                    : "bg-gray-50 border border-gray-200 dark:bg-gray-700/30 dark:border-gray-700"
              }`}>
                <div className="flex items-center">
                  {isOverdue() ? (
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  ) : isDueToday() ? (
                    <Clock className="w-5 h-5 mr-2 text-purple-500" />
                  ) : (
                    <Calendar className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${
                      isOverdue() 
                        ? "text-red-800 dark:text-red-300" 
                        : isDueToday()
                          ? "text-purple-800 dark:text-purple-300"
                          : "text-gray-700 dark:text-gray-300"
                    }`}>
                      {isOverdue() 
                        ? "Overdue" 
                        : isDueToday() 
                          ? "Due Today" 
                          : "Due Date"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(task.dueDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subtasks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Subtasks</h3>
              {!showSubtaskInput && (
                <button
                  onClick={() => setShowSubtaskInput(true)}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Subtask
                </button>
              )}
            </div>

            {showSubtaskInput && (
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Enter subtask..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddSubtask();
                    }
                  }}
                />
                <button
                  onClick={handleAddSubtask}
                  className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowSubtaskInput(false);
                    setNewSubtask("");
                  }}
                  className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {task.subtasks && task.subtasks.length > 0 ? (
              <ul className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <li key={subtask._id} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                    <button
                      onClick={() => handleToggleSubtask(subtask._id, subtask.completed)}
                      className="mr-3 focus:outline-none"
                    >
                      {subtask.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <span className={`${subtask.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
                      {subtask.title}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No subtasks yet. Add a subtask to break down this task.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Status</h3>
            <select
              value={task.completed ? "completed" : "active"}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Priority</h3>
            <select
              value={task.priority}
              onChange={handlePriorityChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {task.completedAt && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Completed</h3>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                <span>{formatDate(task.completedAt)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Delete Task</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
