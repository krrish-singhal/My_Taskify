import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'react-feather';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-purple-600 dark:text-purple-400">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Page Not Found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex justify-center mt-6">
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;