"use client"

import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { useTask } from "../contexts/TaskContext"
import { SearchIcon, Calendar, Clock, Tag, CheckCircle, AlertCircle } from "lucide-react"

const Search = () => {
  const location = useLocation()
  const { tasks } = useTask()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)

  // Get search query from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q") || ""
    setSearchQuery(query)

    if (query && tasks) {
      performSearch(query)
    }
  }, [location.search, tasks])

  // Perform search
  const performSearch = (query) => {
    setLoading(true)

    if (!tasks || !query) {
      setSearchResults([])
      setLoading(false)
      return
    }

    // Filter tasks based on search query
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(query.toLowerCase())) ||
        (task.category && task.category.toLowerCase().includes(query.toLowerCase())),
    )

    setSearchResults(filtered)
    setLoading(false)
  }

  // Handle search form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Search Results</h2>

      {/* Search form */}
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="flex">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 text-gray-700 placeholder-gray-600 bg-white border border-gray-300 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
              placeholder="Search for tasks..."
            />
          </div>
          <button
            type="submit"
            className="ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            Search
          </button>
        </form>
      </div>

      {/* Search results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-purple-500 border-r-transparent align-middle"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Searching...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchResults.map((task) => (
              <Link
                key={task._id}
                to={`/tasks/${task._id}`}
                className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : task.important ? (
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 mt-0.5"></div>
                      )}
                      <div>
                        <h3
                          className={`text-lg font-medium ${
                            task.completed
                              ? "text-gray-500 dark:text-gray-400 line-through"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            {formatDate(task.dueDate)}
                          </div>
                          {task.category && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Tag className="w-3.5 h-3.5 mr-1" />
                              {task.category}
                            </div>
                          )}
                          {task.estimatedTime && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              {task.estimatedTime} min
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <SearchIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">No results found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? `No tasks matching "${searchQuery}"` : "Enter a search term to find tasks"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
