import React from 'react';
import { Link } from 'react-router-dom';
import { useTask } from '../contexts/TaskContext';
import { Clock, Star, CheckCircle, Circle, Calendar, AlertTriangle } from 'lucide-react';
import UserAvatar from './UserAvatar';

const TaskCard = ({ task }) => {
  const { updateTask, toggleImportant } = useTask();
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };
  
  // Check if task is due today
  const isDueToday = () => {
    if (!task.dueDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate.getTime() === today.getTime();
  };
  
  // Check if task is important
  const isImportant = () => {
    return task.tags && task.tags.includes('important');
  };
  
  // Toggle task completion
  const handleToggleComplete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateTask(task._id, { completed: !task.completed });
  };
  
  // Toggle task importance
  const handleToggleImportant = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleImportant(task._id, !isImportant());
  };
  
  return (
    <Link 
      to={`/tasks/${task._id}`}
      className={`block mb-3 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md`}
    >
      <div className={`p-4 rounded-lg border ${
        task.completed 
          ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900' 
          : isOverdue() 
            ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900' 
            : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <button 
              onClick={handleToggleComplete}
              className="mt-1 focus:outline-none"
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <div>
              <h3 className={`font-medium text-gray-800 dark:text-gray-200 ${
                task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {task.dueDate && (
                  <div className={`flex items-center text-xs ${
                    isOverdue() 
                      ? 'text-red-600 dark:text-red-400' 
                      : isDueToday()
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {isOverdue() ? (
                      <AlertTriangle className="w-3 h-3 mr-1" />
                    ) : isDueToday() ? (
                      <Clock className="w-3 h-3 mr-1" />
                    ) : (
                      <Calendar className="w-3 h-3 mr-1" />
                    )}
                    {formatDate(task.dueDate)}
                  </div>
                )}
                
                {task.priority && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                      : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleImportant}
              className="focus:outline-none"
              aria-label={isImportant() ? 'Remove from important' : 'Mark as important'}
            >
              <Star 
                className={`w-5 h-5 ${
                  isImportant() 
                    ? 'text-yellow-500 fill-yellow-500' 
                    : 'text-gray-400 hover:text-yellow-500'
                }`} 
              />
            </button>
          </div>
        </div>
        
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-3 pl-8">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {task.subtasks.filter(subtask => subtask.completed).length} of {task.subtasks.length} subtasks completed
            </div>
            <div className="w-full h-1 mt-1 bg-gray-200 rounded-full dark:bg-gray-700">
              <div 
                className="h-1 bg-purple-600 rounded-full" 
                style={{ 
                  width: `${(task.subtasks.filter(subtask => subtask.completed).length / task.subtasks.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default TaskCard;
