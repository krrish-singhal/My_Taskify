import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaListUl, FaLock } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, isGuest } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Manage Your Tasks Efficiently
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            A powerful task management application to help you stay organized and productive.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn bg-white text-primary-700 hover:bg-gray-100 text-lg px-8 py-3">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn bg-white text-primary-700 hover:bg-gray-100 text-lg px-8 py-3">
                  Get Started
                </Link>
                <Link to="/dashboard" className="btn bg-primary-700 text-white hover:bg-primary-800 text-lg px-8 py-3">
                  Continue as Guest
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Easily mark tasks as complete and track your progress over time.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaListUl className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organize Tasks</h3>
              <p className="text-gray-600">
                Categorize tasks by priority and set due dates to stay on schedule.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
              <p className="text-gray-600">
                Your data is protected with our advanced authentication system.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Organized?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of users who are already managing their tasks more efficiently.
          </p>
          
          {!isAuthenticated && !isGuest && (
            <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
              Create Your Free Account
            </Link>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;