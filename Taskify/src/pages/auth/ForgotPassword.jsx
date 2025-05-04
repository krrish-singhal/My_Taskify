"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Mail, ArrowLeft } from "lucide-react"
import Logo from "../../components/Logo"
import toast from "react-hot-toast"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { forgotPassword, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid")
      return
    }

    try {
      await forgotPassword(email)
      setSuccess(true)
      setError("")
      toast.success("Password reset email sent! Please check your inbox.")
    } catch (error) {
      console.error("Forgot password error:", error)
      setError(error.response?.data?.message || "Failed to send reset email")
      toast.error(error.response?.data?.message || "Failed to send reset email")
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
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Forgot Password</h1>

              {success ? (
                <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-md dark:bg-green-900 dark:text-green-200">
                  Password reset email sent! Please check your inbox.
                </div>
              ) : (
                <>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  {error && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-200">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <label className="block text-sm">
                      <span className="text-gray-700 dark:text-gray-400">Email</span>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <input
                          className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-300"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError("")
                          }}
                          placeholder="your@email.com"
                        />
                      </div>
                    </label>

                    <button
                      type="submit"
                      className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword
