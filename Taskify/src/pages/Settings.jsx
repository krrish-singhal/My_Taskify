"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { Moon, Sun, Save } from "lucide-react"
import toast from "react-hot-toast"
import api from "../api/axios"

const Settings = () => {
  const { user, updateUserProfile } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("appearance")

  // Form states
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    taskReminders: true,
    dueDateAlerts: true,
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordErrors, setPasswordErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accentColor, setAccentColor] = useState("purple")
  const [fontSize, setFontSize] = useState(2)

  // Load user preferences from localStorage or API
  useEffect(() => {
    // Try to load notification settings from localStorage
    const savedNotificationSettings = localStorage.getItem("notificationSettings")
    if (savedNotificationSettings) {
      setNotificationSettings(JSON.parse(savedNotificationSettings))
    }

    // Try to load accent color from localStorage
    const savedAccentColor = localStorage.getItem("accentColor")
    if (savedAccentColor) {
      setAccentColor(savedAccentColor)
      // Apply accent color to the app
      document.documentElement.style.setProperty("--color-primary", `var(--color-${savedAccentColor}-600)`)
      document.documentElement.style.setProperty("--color-primary-hover", `var(--color-${savedAccentColor}-700)`)
    }

    // Try to load font size from localStorage
    const savedFontSize = localStorage.getItem("fontSize")
    if (savedFontSize) {
      setFontSize(Number.parseInt(savedFontSize))
      // Apply font size to the app
      const fontSizeValue =
        Number.parseInt(savedFontSize) === 1 ? "0.875rem" : Number.parseInt(savedFontSize) === 2 ? "1rem" : "1.125rem"
      document.documentElement.style.setProperty("--base-font-size", fontSizeValue)
    }
  }, [])

  // Handle notification settings change
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target
    const updatedSettings = {
      ...notificationSettings,
      [name]: checked,
    }
    setNotificationSettings(updatedSettings)

    // Save to localStorage
    localStorage.setItem("notificationSettings", JSON.stringify(updatedSettings))

    // Show success toast
    toast.success("Notification settings updated")
  }

  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    })

    // Clear errors when typing
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: "",
      })
    }
  }

  // Handle password form submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const errors = {}
    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required"
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required"
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters"
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password"
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      // Call API to change password
      await api.put("/api/users/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })

      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast.success("Password updated successfully")
    } catch (error) {
      console.error("Error changing password:", error)

      if (error.response?.data?.message) {
        if (error.response.data.message.includes("incorrect")) {
          setPasswordErrors({
            currentPassword: error.response.data.message,
          })
        } else {
          toast.error(error.response.data.message)
        }
      } else {
        toast.error("Failed to update password. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle accent color change
  const handleAccentColorChange = (color) => {
    setAccentColor(color)

    // Save to localStorage
    localStorage.setItem("accentColor", color)

    // Apply accent color to the app
    document.documentElement.style.setProperty("--color-primary", `var(--color-${color}-600)`)
    document.documentElement.style.setProperty("--color-primary-hover", `var(--color-${color}-700)`)

    toast.success(`Theme color updated to ${color}`)
  }

  // Handle font size change
  const handleFontSizeChange = (e) => {
    const size = Number.parseInt(e.target.value)
    setFontSize(size)

    // Save to localStorage
    localStorage.setItem("fontSize", size.toString())

    // Apply font size to the app
    const fontSizeValue = size === 1 ? "0.875rem" : size === 2 ? "1rem" : "1.125rem"
    document.documentElement.style.setProperty("--base-font-size", fontSizeValue)

    toast.success("Font size updated")
  }

  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Settings</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-3 font-medium text-sm focus:outline-none ${
              activeTab === "appearance"
                ? "text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400"
                : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("appearance")}
          >
            Appearance
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm focus:outline-none ${
              activeTab === "notifications"
                ? "text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400"
                : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm focus:outline-none ${
              activeTab === "privacy"
                ? "text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400"
                : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy & Security
          </button>
        </div>

        <div className="p-6">
          {activeTab === "appearance" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Theme</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose between light and dark mode for the application.
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Color Scheme</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Choose your preferred accent color for buttons and interactive elements.
                </p>
                <div className="grid grid-cols-5 gap-4">
                  <button
                    className={`w-full h-10 bg-purple-600 rounded-md hover:ring-2 hover:ring-offset-2 hover:ring-purple-500 transition-all ${accentColor === "purple" ? "ring-2 ring-offset-2 ring-purple-500" : ""}`}
                    onClick={() => handleAccentColorChange("purple")}
                  ></button>
                  <button
                    className={`w-full h-10 bg-blue-600 rounded-md hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all ${accentColor === "blue" ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                    onClick={() => handleAccentColorChange("blue")}
                  ></button>
                  <button
                    className={`w-full h-10 bg-green-600 rounded-md hover:ring-2 hover:ring-offset-2 hover:ring-green-500 transition-all ${accentColor === "green" ? "ring-2 ring-offset-2 ring-green-500" : ""}`}
                    onClick={() => handleAccentColorChange("green")}
                  ></button>
                  <button
                    className={`w-full h-10 bg-red-600 rounded-md hover:ring-2 hover:ring-offset-2 hover:ring-red-500 transition-all ${accentColor === "red" ? "ring-2 ring-offset-2 ring-red-500" : ""}`}
                    onClick={() => handleAccentColorChange("red")}
                  ></button>
                  <button
                    className={`w-full h-10 bg-yellow-600 rounded-md hover:ring-2 hover:ring-offset-2 hover:ring-yellow-500 transition-all ${accentColor === "yellow" ? "ring-2 ring-offset-2 ring-yellow-500" : ""}`}
                    onClick={() => handleAccentColorChange("yellow")}
                  ></button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Adjust the font size for better readability.
                </p>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">A</span>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    className="mx-4 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-lg text-gray-600 dark:text-gray-400">A</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Notification Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Email Notifications</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Task Reminders</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get reminders for upcoming and overdue tasks
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="taskReminders"
                      checked={notificationSettings.taskReminders}
                      onChange={handleNotificationChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Due Date Alerts</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive alerts when tasks are approaching their due date
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="dueDateAlerts"
                      checked={notificationSettings.dueDateAlerts}
                      onChange={handleNotificationChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Privacy & Security</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Data Privacy</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Control how your data is used and stored within the application.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="analytics"
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="analytics" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Allow anonymous usage analytics
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="cookies"
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="cookies" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Accept cookies for better experience
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Password Security</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Change your password to keep your account secure.
                  </p>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 text-gray-700 dark:text-gray-300 border ${
                          passwordErrors.currentPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700`}
                      />
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-xs text-red-500">{passwordErrors.currentPassword}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 text-gray-700 dark:text-gray-300 border ${
                          passwordErrors.newPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700`}
                      />
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-xs text-red-500">{passwordErrors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 text-gray-700 dark:text-gray-300 border ${
                          passwordErrors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700`}
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Data Management</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Export or delete your account data.</p>
                  <div className="space-x-4">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                      Export Data
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
