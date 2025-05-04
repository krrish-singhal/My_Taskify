import { Link } from "react-router-dom"
import { CheckSquare } from "lucide-react"

const Logo = ({ size = "default" }) => {
  const sizeClasses = {
    small: "text-lg",
    default: "text-xl",
    large: "text-2xl",
  }

  return (
    <Link to="/" className="flex items-center">
      <CheckSquare className={`${size === "large" ? "w-7 h-7" : "w-6 h-6"} text-purple-600`} />
      <span className={`ml-2 font-bold ${sizeClasses[size]} text-gray-800 dark:text-gray-200`}>Taskify</span>
    </Link>
  )
}

export default Logo
