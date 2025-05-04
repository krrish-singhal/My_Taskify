import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, Bell, Sun, Moon, Search } from 'react-feather';
import UserAvatar from './UserAvatar';

const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [profileDropdown, setProfileDropdown] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);
  const notificationsRef = React.useRef(null);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="z-10 py-4 bg-white shadow-sm dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={() => setSidebarOpen(true)}
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search input */}
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              className="w-full pl-8 pr-2 py-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
              type="text"
              placeholder="Search for tasks..."
              aria-label="Search"
            />
          </div>
        </div>

        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Theme toggler */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleTheme}
              aria-label="Toggle color mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </li>

          {/* Notifications menu */}
          <li className="relative" ref={notificationsRef}>
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span
                className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
                aria-hidden="true"
              ></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:text-gray-300 dark:border-gray-700 dark:bg-gray-700">
                <div className="px-4 py-3 text-sm font-medium text-center border-b dark:border-gray-700">
                  Notifications
                </div>
                <div className="px-4 py-3 text-sm border-b dark:border-gray-700">
                  <div className="font-semibold">New task assigned</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">2 min ago</div>
                </div>
                <div className="px-4 py-3 text-sm border-b dark:border-gray-700">
                  <div className="font-semibold">Task deadline approaching</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</div>
                </div>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-center text-gray-700 rounded-md dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  View all
                </a>
              </div>
            )}
          </li>

          {/* Profile menu */}
          <li className="relative" ref={dropdownRef}>
            <button
              className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={() => setProfileDropdown(!profileDropdown)}
              aria-label="Account"
              aria-haspopup="true"
            >
              <UserAvatar user={user} size="sm" />
            </button>
            {profileDropdown && (
              <div className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:text-gray-300 dark:border-gray-700 dark:bg-gray-700">
                <div className="px-4 py-3 text-sm border-b dark:border-gray-700">
                  <div className="font-semibold text-gray-700 dark:text-gray-200">{user.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 rounded-md dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setProfileDropdown(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 rounded-md dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setProfileDropdown(false)}
                >
                  Settings
                </Link>
                <button
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 rounded-md dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;