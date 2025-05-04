"use client"

import { createContext, useState, useContext, useCallback, useEffect } from "react"
import axios from "../api/axios"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  // Check if user is logged in
  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const response = await axios.get("/api/users/me")
        setUser(response.data.user)
      } catch (error) {
        console.error("Auth status check error:", error)
        localStorage.removeItem("token")
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  // Register
  const register = async (userData) => {
    setLoading(true)
    setAuthError(null)
    try {
      const response = await axios.post("/api/auth/register", userData)
      toast.success(response.data.message || "Registration successful!")
      return response.data
    } catch (error) {
      console.error("Registration error:", error)
      const errorMessage = error.response?.data?.message || "Registration failed"
      setAuthError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Login
  const login = async (credentials) => {
    setLoading(true)
    setAuthError(null)
    try {
      const response = await axios.post("/api/auth/login", credentials)

      // Save token to localStorage
      localStorage.setItem("token", response.data.token)

      setUser(response.data.user)
      toast.success("Login successful!")
      return response.data
    } catch (error) {
      console.error("Login error:", error)
      const errorMessage = error.response?.data?.message || "Login failed"
      setAuthError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Google Login/Register
  const googleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = `${axios.defaults.baseURL}/api/auth/google`
  }

  // Guest Login
  const guestLogin = async () => {
    setLoading(true)
    setAuthError(null)
    try {
      const response = await axios.post("/api/auth/guest")

      // Save token to localStorage
      localStorage.setItem("token", response.data.token)

      setUser(response.data.user)
      toast.success("Welcome, Guest!")
      return response.data
    } catch (error) {
      console.error("Guest login error:", error)
      const errorMessage = error.response?.data?.message || "Guest login failed"
      setAuthError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    setLoading(true)
    try {
      await axios.post("/api/auth/logout")

      // Remove token from localStorage
      localStorage.removeItem("token")

      setUser(null)
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Logout failed")

      // Even if the server request fails, clear local storage
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Forgot Password
  const forgotPassword = async (email) => {
    setLoading(true)
    setAuthError(null)
    try {
      const response = await axios.post("/api/auth/forgot-password", { email })
      toast.success(response.data.message || "Password reset email sent!")
      return response.data
    } catch (error) {
      console.error("Forgot password error:", error)
      const errorMessage = error.response?.data?.message || "Failed to send reset email"
      setAuthError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Reset Password
  const resetPassword = async (token, password) => {
    setLoading(true)
    setAuthError(null)
    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, { password })
      toast.success(response.data.message || "Password reset successful!")
      return response.data
    } catch (error) {
      console.error("Reset password error:", error)
      const errorMessage = error.response?.data?.message || "Failed to reset password"
      setAuthError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update Profile
  const updateProfile = async (userData) => {
    setLoading(true)
    try {
      const response = await axios.put("/api/users/profile", userData)
      setUser(response.data.user)
      toast.success("Profile updated successfully")
      return response.data
    } catch (error) {
      console.error("Update profile error:", error)
      toast.error(error.response?.data?.message || "Failed to update profile")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Change Password
  const changePassword = async (passwordData) => {
    setLoading(true)
    try {
      const response = await axios.post("/api/auth/change-password", passwordData)
      toast.success(response.data.message || "Password changed successfully")
      return response.data
    } catch (error) {
      console.error("Change password error:", error)
      toast.error(error.response?.data?.message || "Failed to change password")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    authError,
    register,
    login,
    googleLogin,
    guestLogin,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    checkAuthStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
