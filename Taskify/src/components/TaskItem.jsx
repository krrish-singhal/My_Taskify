import React from 'react';
import { FaTrash, FaCheck, FaUndo, FaEdit } from 'react-icons/fa';

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }) => {
  return (
    <div className={`card mb-3 transition-all ${task.completed ? 'bg-gray-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggleComplete(task._id)}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border ${
              task.completed
                ? 'bg-primary-500 border-primary-500 text-white'
                : 'border-gray-300'
            } flex items-center justify-center`}
          >
            {task.completed && <FaCheck className="w-3 h-3" />}
          </button>
          
          <div className="flex-1">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
            {task.dueDate && (
              <p className="mt-1 text-xs text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-500 hover:text-primary-500"
            aria-label="Edit task"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-500 hover:text-red-500"
            aria-label="Delete task"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      {task.priority && (
        <div className="mt-2">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            task.priority === 'high' 
              ? 'bg-red-100 text-red-800' 
              : task.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
          }`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskItem;