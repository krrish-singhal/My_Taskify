import React from 'react';
import { CheckSquare, Clock, AlertTriangle, BarChart2 } from 'react-feather';

const DashboardStats = ({ stats }) => {
  if (!stats) {
    return (
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <div className="w-full h-8 bg-gray-200 rounded-md dark:bg-gray-700 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
      {/* Total Tasks */}
      <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
        <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
          <BarChart2 className="w-5 h-5" />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Tasks
          </p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {stats.statusCounts.todo + 
             stats.statusCounts['in-progress'] + 
             stats.statusCounts.review + 
             stats.statusCounts.completed}
          </p>
        </div>
      </div>
      
      {/* Completed Tasks */}
      <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
        <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
          <CheckSquare className="w-5 h-5" />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            Completed Tasks
          </p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {stats.statusCounts.completed}
          </p>
        </div>
      </div>
      
      {/* Tasks Due Today */}
      <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
        <div className="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full dark:text-purple-100 dark:bg-purple-500">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            Due Today
          </p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {stats.tasksDueToday}
          </p>
        </div>
      </div>
      
      {/* Overdue Tasks */}
      <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
        <div className="p-3 mr-4 text-red-500 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-500">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            Overdue
          </p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {stats.overdueTasks}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;