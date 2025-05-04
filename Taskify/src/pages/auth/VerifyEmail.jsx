"use client"

import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import Logo from "../../components/Logo"

const VerifyEmail = () => {
  const [status, setStatus] = useState("loading") // loading, success, error
  const [message, setMessage] = useState("")
  const { token } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/auth/verify/${token}`)
        setStatus("success")
        setMessage(response.data.message || "Email verified successfully! You can now log in.")

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login")
        }, 3000)
      } catch (error) {
        setStatus("error")
        setMessage(
          error.response?.data?.message || "Failed to verify email. The verification link may be invalid or expired.",
        )
      }
    }

    verifyEmail()
  }, [token, navigate])

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto">
          <div className="flex items-center justify-center p-6">
            <div className="w-full">
              <div className="flex justify-center mb-6">
                <Logo size="large" />
              </div>
              <h1 className="mb-4 text-xl font-semibold text-center text-gray-700 dark:text-gray-200">
                Email Verification
              </h1>

              <div className="flex flex-col items-center justify-center p-6">
                {status === "loading" && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-t-4 border-purple-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying your email...</p>
                  </div>
                )}

                {status === "success" && (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <p className="mt-4 text-center text-gray-600 dark:text-gray-400">{message}</p>
                    <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                      Redirecting to login page...
                    </p>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex flex-col items-center">
                    <XCircle className="w-16 h-16 text-red-500" />
                    <p className="mt-4 text-center text-gray-600 dark:text-gray-400">{message}</p>
                  </div>
                )}
              </div>

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

export default VerifyEmail
