import Logo from "./Logo"

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mb-4">
        <Logo size="large" />
      </div>
      <div className="w-12 h-12 border-4 border-t-4 border-purple-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  )
}

export default LoadingScreen
