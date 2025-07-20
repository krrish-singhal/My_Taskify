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

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        setUser(null)
        return
      }

      const response = await axios.get(`/api/users/me`)
      setUser(response.data.user)
    } catch (error) {
      console.error("Auth status check error:", error)
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const register = async (userData) => {
    setLoading(true)
    setAuthError(null)
    try {
      const response = await axios.post(`/api/auth/register`, userData)
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

  const login = async (credentials) => {
    setLoading(true)
    setAuthError(null)
    try {
      const response = await axios.post(`/api/auth/login`, credentials)
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

  const googleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
};


  const guestLogin = async () => {
    setLoading(true)
    setAuthError(null)
    try {
      const response = await axios.post(`/api/auth/guest`)
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

  const logout = async () => {
    setLoading(true)
    try {
      await axios.post(`/api/auth/logout`)
      localStorage.removeItem("token")
      setUser(null)
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Logout failed")
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (email) => {
    setLoading(true)
    setAuthError(null)
    try {
      const response = await axios.post(`/api/auth/forgot-password`, { email })
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

const resetPassword = async (token, password) => {
  setLoading(true);
  setAuthError(null);

  try {
    const response = await axios.post('http://localhost:5000/api/auth/reset-password/' + token, { password });


    // Check if the response contains expected success message
    if (response.status === 200 && response.data?.message) {
      return response.data;
    } else {
      // If API returns 200 but message is empty or unexpected
      throw new Error("Unexpected response from server");
    }
  } catch (error) {
    console.error("Reset password error:", error);
    const errorMessage = error.response?.data?.message || "Failed to reset password";
    setAuthError(errorMessage);
    throw new Error(errorMessage);  // Let ResetPassword.jsx handle toast
  } finally {
    setLoading(false);
  }
};


  const updateProfile = async (userData) => {
    setLoading(true)
    try {
      const response = await axios.put(`/api/users/profile`, userData)
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

  const changePassword = async (passwordData) => {
    setLoading(true)
    try {
      const response = await axios.post(`/api/auth/change-password`, passwordData)
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
