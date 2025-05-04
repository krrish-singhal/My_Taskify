"use client"

import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react"
import Logo from "../../components/Logo"
import toast from "react-hot-toast"

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { token } = useParams()
  const { resetPassword, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    if (!password) {
      setError("Password is required")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      await resetPassword(token, password)
      setSuccess(true)
      setError("")
      toast.success("Password reset successful! You can now log in with your new password.")
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      console.error("Reset password error:", error)
      setError(error.response?.data?.message || "Failed to reset password. The token may be invalid or expired.")
      toast.error(error.response?.data?.message || "Failed to reset password")
    }
  }

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto">
          <div className="flex items-center justify-center p-6">
            <div className="w-full">
              <div className="flex justify-center mb-6">
                <Logo size="large" />
              </div>
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Reset Password</h1>

              {success ? (
                <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-md dark:bg-green-900 dark:text-green-200">
                  Password reset successful! Redirecting to login page...
                </div>
              ) : (
                <>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Enter your new password below.</p>

                  {error && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-200">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <label className="block text-sm">
                      <span className="text-gray-700 dark:text-gray-400">New Password</span>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <input
                          className="block w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-300"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setError("")
                          }}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 dark:text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </label>

                    <label className="block mt-4 text-sm">
                      <span className="text-gray-700 dark:text-gray-400">Confirm New Password</span>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <input
                          className="block w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-300"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            setError("")
                          }}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 dark:text-gray-400"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </label>

                    <button
                      type="submit"
                      className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                      disabled={loading}
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                  </form>
                </>
              )}

              <p className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
