"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTask } from "../../contexts/TaskContext"
import { ArrowLeft, Calendar, Star, Trash2 } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const EditTask = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchTask, updateTask, deleteTask, loading } = useTask()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: null,
    tags: [],
    subtasks: [],
  })
  const [newSubtask, setNewSubtask] = useState("")
  const [errors, setErrors] = useState({})
  const [isImportant, setIsImportant] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const loadTask = async () => {
      try {
        const task = await fetchTask(id)

        setFormData({
          title: task.title || "",
          description: task.description || "",
          priority: task.priority || "medium",
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          tags: task.tags || [],
          subtasks: task.subtasks || [],
        })

        // Check if task is marked as important
        setIsImportant(task.tags && task.tags.includes("important"))
      } catch (error) {
        console.error("Error loading task:", error)
        navigate("/tasks")
      }
    }

    loadTask()
  }, [id, fetchTask, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleDateChange = (date) => {
    setFormData({ ...formData, dueDate: date })
  }

  const addSubtask = () => {
    if (!newSubtask.trim()) return

    setFormData({
      ...formData,
      subtasks: [...formData.subtasks, { title: newSubtask.trim(), completed: false }],
    })
    setNewSubtask("")
  }

  const removeSubtask = (index) => {
    const updatedSubtasks = [...formData.subtasks]
    updatedSubtasks.splice(index, 1)
    setFormData({ ...formData, subtasks: updatedSubtasks })
  }

  const toggleImportant = () => {
    setIsImportant(!isImportant)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    try {
      // Add or remove important tag
      const tags = [...formData.tags.filter((tag) => tag !== "important")]
      if (isImportant) {
        tags.push("important")
      }

      await updateTask(id, {
        ...formData,
        tags,
      })

      navigate(`/tasks/${id}`)
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleDeleteTask = async () => {
    try {
      await deleteTask(id)
      navigate("/tasks")
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Edit Task</h2>
        </div>
        <button
          onClick={() => setConfirmDelete(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Delete Task
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <button
                type="button"
                onClick={toggleImportant}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
              >
                <Star className={`w-4 h-4 mr-1 ${isImportant ? "text-yellow-500 fill-yellow-500" : ""}`} />
                {isImportant ? "Important" : "Mark as important"}
              </button>
            </div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white ${
                errors.title ? "border-red-500 dark:border-red-500" : "border-gray-300"
              }`}
              placeholder="Task title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
              placeholder="Task description"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <DatePicker
                  selected={formData.dueDate}
                  onChange={handleDateChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                  placeholderText="Select due date"
                  dateFormat="MMMM d, yyyy"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtasks</label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                placeholder="Add a subtask"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSubtask()
                  }
                }}
              />
              <button
                type="button"
                onClick={addSubtask}
                className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Add
              </button>
            </div>

            {formData.subtasks.length > 0 && (
              <ul className="space-y-2 mt-3">
                {formData.subtasks.map((subtask, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md dark:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => {
                          const updatedSubtasks = [...formData.subtasks]
                          updatedSubtasks[index].completed = !updatedSubtasks[index].completed
                          setFormData({ ...formData, subtasks: updatedSubtasks })
                        }}
                        className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className={`text-gray-700 dark:text-gray-300 ${subtask.completed ? "line-through" : ""}`}>
                        {subtask.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
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
  )
}

export default EditTask
