import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Home, Calendar, List, CheckSquare, Clock, Star } from 'react-feather';
import { useTask } from '../contexts/TaskContext';
import Logo from './Logo';

const MobileMenu = ({ open, setOpen }) => {
  const { stats } = useTask();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-600 bg-opacity-75" 
        onClick={() => setOpen(false)}
        aria-hidden="true"
      ></div>
      
      {/* Sidebar */}
      <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-white dark:bg-gray-800">
        <div className="absolute top-0 right-0 pt-2">
          <button
            className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="flex items-center flex-shrink-0 px-4">
          <Logo />
          <span className="ml-3 text-lg font-bold text-gray-800 dark:text-gray-200">Taskify</span>
        </div>
        
        <div className="flex-1 h-0 mt-5 overflow-y-auto">
          <nav className="px-2 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
              }
              onClick={() => setOpen(false)}
            >
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </NavLink>
            
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
              }
              onClick={() => setOpen(false)}
            >
              <List className="w-5 h-5 mr-3" />
              All Tasks
            </NavLink>
            
            <NavLink
              to="/today"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
              }
              onClick={() => setOpen(false)}
            >
              <CheckSquare className="w-5 h-5 mr-3" />
              Today
              {stats && stats.tasksDueToday > 0 && (
                <span className="ml-auto px-2 py-1 text-xs font-medium leading-none text-white bg-purple-600 rounded-full">
                  {stats.tasksDueToday}
                </span>
              )}
            </NavLink>
            
            <NavLink
              to="/upcoming"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
              }
              onClick={() => setOpen(false)}
            >
              <Calendar className="w-5 h-5 mr-3" />
              Upcoming
            </NavLink>
            
            <NavLink
              to="/important"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
              }
              onClick={() => setOpen(false)}
            >
              <Star className="w-5 h-5 mr-3" />
              Important
            </NavLink>
          </nav>
        </div>
      </div>
      
      <div className="flex-shrink-0 w-14" aria-hidden="true">
        {/* Dummy element to force sidebar to shrink to fit close icon */}
      </div>
    </div>
  );
};

export default MobileMenu;