import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTask } from "../contexts/TaskContext";
import { Home, CheckSquare, Calendar, Clock, Star, X, List, Settings, HelpCircle, LogOut, Plus, CheckCircle } from 'lucide-react';
import { useState, useEffect } from "react";
import Logo from "./Logo";
import CreateTaskModal from "./CreateTaskModal";

const Sidebar = ({ open, setOpen }) => {
  const { user, logout } = useAuth();
  const { stats, fetchTaskStats } = useTask();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTaskStats();
  }, [fetchTaskStats]);

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/", 
      icon: <Home className="w-5 h-5" /> 
    },
    { 
      name: "All Tasks", 
      path: "/tasks", 
      icon: <List className="w-5 h-5" />,
      badge: stats?.total || 0
    },
    { 
      name: "Today", 
      path: "/tasks/today", 
      icon: <CheckSquare className="w-5 h-5" />,
      badge: stats?.dueToday || 0
    },
    { 
      name: "Upcoming", 
      path: "/tasks/upcoming", 
      icon: <Calendar className="w-5 h-5" /> 
    },
    { 
      name: "Important", 
      path: "/tasks/important", 
      icon: <Star className="w-5 h-5" /> 
    },
    { 
      name: "Completed", 
      path: "/tasks/completed", 
      icon: <CheckCircle className="w-5 h-5" />,
      badge: stats?.completed || 0
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-10 bg-gray-900 bg-opacity-50 lg:hidden" 
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 lg:static lg:mt-0 ${
          open ? "left-0" : "-left-64"
        } lg:left-0 lg:translate-x-0 transition-all duration-300 ease-in-out`}
      >
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-between px-6 lg:hidden">
            <Logo />
            <button
              className="p-1 rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="hidden lg:block">
            <div className="px-6 py-3">
              <Logo />
            </div>
          </div>

          <ul className="mt-6">
            {navItems.map((item) => (
              <li className="relative px-6 py-1" key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex items-center justify-between w-full px-4 py-2 text-sm font-semibold transition-colors duration-150 rounded-lg ${
                      isActive 
                        ? "bg-purple-600 text-white" 
                        : "hover:bg-purple-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  <span className="inline-flex items-center">
                    {item.icon}
                    <span className="ml-4">{item.name}</span>
                  </span>
                  {item.badge > 0 && (
                    <span className="px-2 py-1 text-xs font-medium leading-none text-white bg-purple-700 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="px-6 my-6">
            <button
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              onClick={() => setShowCreateModal(true)}
            >
              Create Task
              <Plus className="w-4 h-4 ml-2" />
            </button>
          </div>

          <div className="px-6 mt-auto">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <ul>
                <li className="relative px-6 py-1">
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      `inline-flex items-center w-full px-4 py-2 text-sm font-semibold transition-colors duration-150 rounded-lg ${
                        isActive ? "bg-purple-600 text-white" : "hover:bg-purple-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <Settings className="w-5 h-5" />
                    <span className="ml-4">Settings</span>
                  </NavLink>
                </li>
                <li className="relative px-6 py-1">
                  <NavLink
                    to="/help"
                    className={({ isActive }) =>
                      `inline-flex items-center w-full px-4 py-2 text-sm font-semibold transition-colors duration-150 rounded-lg ${
                        isActive ? "bg-purple-600 text-white" : "hover:bg-purple-100 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span className="ml-4">Help</span>
                  </NavLink>
                </li>
                <li className="relative px-6 py-1">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center w-full px-4 py-2 text-sm font-semibold transition-colors duration-150 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="ml-4">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
};

export default Sidebar;
