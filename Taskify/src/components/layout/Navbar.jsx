"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useTheme } from "../../contexts/ThemeContext"
import { useTask } from "../../contexts/TaskContext"
import { Menu, Bell, Search, Moon, Sun, User, Settings, HelpCircle, LogOut, Calendar, Clock } from "lucide-react"
import Logo from "../Logo"

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { tasks } = useTask()
  const navigate = useNavigate()

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)

  const profileMenuRef = useRef(null)
  const notificationsMenuRef = useRef(null)
  const searchRef = useRef(null)

  // Generate notifications based on tasks
  useEffect(() => {
    if (!tasks) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const newNotifications = []

    // Important tasks due today
    const importantTodayTasks = tasks.filter(
      (task) => task.important && new Date(task.dueDate).toDateString() === today.toDateString() && !task.completed,
    )

    if (importantTodayTasks.length > 0) {
      newNotifications.push({
        id: "important-today",
        title: `${importantTodayTasks.length} important ${importantTodayTasks.length === 1 ? "task" : "tasks"} due today`,
        time: new Date(),
        icon: <Clock className="w-4 h-4 text-red-500" />,
        link: "/tasks/today",
      })
    }

    // Overdue tasks
    const overdueTasks = tasks.filter((task) => new Date(task.dueDate) < today && !task.completed)

    if (overdueTasks.length > 0) {
      newNotifications.push({
        id: "overdue",
        title: `${overdueTasks.length} overdue ${overdueTasks.length === 1 ? "task" : "tasks"}`,
        time: new Date(),
        icon: <Clock className="w-4 h-4 text-red-500" />,
        link: "/tasks/all",
      })
    }

    // Tasks due tomorrow
    const tomorrowTasks = tasks.filter(
      (task) => new Date(task.dueDate).toDateString() === tomorrow.toDateString() && !task.completed,
    )

    if (tomorrowTasks.length > 0) {
      newNotifications.push({
        id: "tomorrow",
        title: `${tomorrowTasks.length} ${tomorrowTasks.length === 1 ? "task" : "tasks"} due tomorrow`,
        time: new Date(),
        icon: <Calendar className="w-4 h-4 text-blue-500" />,
        link: "/tasks/upcoming",
      })
    }

    setNotifications(newNotifications)
    setHasUnreadNotifications(newNotifications.length > 0)
  }, [tasks])

  // Search functionality
  useEffect(() => {
    if (searchQuery.length >= 3 && tasks) {
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setSearchResults(filtered)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }, [searchQuery, tasks])

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target)) {
        setIsNotificationsMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearchResults(false)
    }
  }

  const handleSearchResultClick = (taskId) => {
    navigate(`/tasks/${taskId}`)
    setSearchQuery("")
    setShowSearchResults(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  // Format relative time for notifications
  const formatRelativeTime = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  return (
    <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={onMenuClick}
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 dark:text-white" />
        </button>

        {/* Brand */}
        <div className="hidden lg:block">
          <Logo />
        </div>

        {/* Search */}
        <div className="flex justify-center flex-1 lg:mr-32" ref={searchRef}>
          <div className="relative w-full max-w-xl mr-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <form onSubmit={handleSearch}>
              <input
                className="w-full pl-10 pr-3 py-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
                type="text"
                placeholder="Search for tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search"
              />
            </form>

            {/* Search results dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-md shadow-lg dark:bg-gray-800 dark:text-gray-300">
                <ul className="py-1 overflow-auto max-h-60">
                  {searchResults.map((task) => (
                    <li key={task._id} onClick={() => handleSearchResultClick(task._id)}>
                      <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{task.description}</div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showSearchResults && searchResults.length === 0 && searchQuery.length >= 3 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-md shadow-lg dark:bg-gray-800">
                <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  No tasks found matching "{searchQuery}"
                </div>
              </div>
            )}
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
              {theme === "dark" ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </button>
          </li>

          {/* Notifications menu */}
          <li className="relative" ref={notificationsMenuRef}>
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={() => setIsNotificationsMenuOpen(!isNotificationsMenuOpen)}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 dark:text-white" />
              {/* Notification badge */}
              {hasUnreadNotifications && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
                ></span>
              )}
            </button>

            {/* Dropdown */}
            {isNotificationsMenuOpen && (
              <div className="absolute right-0 w-64 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:text-gray-300 dark:border-gray-700 dark:bg-gray-700">
                <div className="px-3 py-2 font-semibold text-gray-600 dark:text-gray-300">Notifications</div>

                {notifications.length > 0 ? (
                  <>
                    {notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        to={notification.link}
                        className="block px-4 py-3 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setIsNotificationsMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          {notification.icon}
                          <div className="ml-3">
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatRelativeTime(notification.time)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}

                    <Link
                      to="/tasks/all"
                      className="block px-4 py-2 text-sm text-center text-purple-600 rounded-md dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsNotificationsMenuOpen(false)}
                    >
                      View all tasks
                    </Link>
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">No new notifications</div>
                )}
              </div>
            )}
          </li>

          {/* Profile menu */}
          <li className="relative" ref={profileMenuRef}>
            <button
              className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-label="Account"
              aria-haspopup="true"
            >
              {user?.profilePicture ? (
                <img
                  className="object-cover w-8 h-8 rounded-full"
                  src={user.profilePicture || "/placeholder.svg"}
                  alt="User avatar"
                  aria-hidden="true"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
                </div>
              )}
            </button>

            {/* Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:text-gray-300 dark:border-gray-700 dark:bg-gray-700">
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user?.name || "Guest User"}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email || "guest@example.com"}</p>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-3 dark:text-gray-400" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-3 dark:text-gray-400" />
                  <span>Settings</span>
                </Link>

                <Link
                  to="/help"
                  className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <HelpCircle className="w-4 h-4 mr-3 dark:text-gray-400" />
                  <span>Help</span>
                </Link>

                <hr className="my-1 border-gray-200 dark:border-gray-600" />

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogOut className="w-4 h-4 mr-3 dark:text-gray-400" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Navbar
