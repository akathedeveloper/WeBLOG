import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FaHome, 
  FaArrowLeft, 
  FaSearch, 
  FaExclamationTriangle,
  FaFileAlt,
  FaUsers,
  FaLaptop,
  FaBriefcase
} from 'react-icons/fa'

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-indigo-300/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-gradient-to-r from-purple-200/30 to-pink-300/30 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-cyan-200/20 to-blue-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-20 h-20 bg-gradient-to-r from-yellow-200/30 to-orange-300/30 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* 404 Number with Animation */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-4 md:space-x-8">
              <span className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-bounce">
                4
              </span>
              <div className="relative">
                <span className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  0
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl md:text-5xl animate-spin" style={{ animationDuration: '3s' }}>
                    🚀
                  </div>
                </div>
              </div>
              <span className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-bounce" style={{ animationDelay: '0.2s' }}>
                4
              </span>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Oops! Page Not Found
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for seems to have drifted into space. 
              Don't worry, we'll help you get back on track and find exactly what you need!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/"
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2"
              >
                <FaHome className="group-hover:scale-110 transition-transform duration-300" />
                <span>Go Back Home</span>
              </Link>
              
              <Link 
                to="/posts"
                className="group inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200/50 transform hover:-translate-y-1"
              >
                <FaSearch className="group-hover:scale-110 transition-transform duration-300" />
                <span>Browse Posts</span>
              </Link>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="mb-12">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Maybe you were looking for:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link 
                  to="/posts"
                  className="group flex items-center space-x-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl border border-blue-200/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <FaFileAlt className="text-white text-sm" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Latest Posts</div>
                    <div className="text-sm text-gray-600">Discover stories</div>
                  </div>
                </Link>

                <Link 
                  to="/authors"
                  className="group flex items-center space-x-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-2xl border border-green-200/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <FaUsers className="text-white text-sm" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Our Authors</div>
                    <div className="text-sm text-gray-600">Meet writers</div>
                  </div>
                </Link>

                <Link 
                  to="/posts/categories/Technology"
                  className="group flex items-center space-x-3 p-4 bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 rounded-2xl border border-purple-200/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                    <FaLaptop className="text-white text-sm" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Tech Articles</div>
                    <div className="text-sm text-gray-600">Latest tech</div>
                  </div>
                </Link>

                <Link 
                  to="/posts/categories/Business"
                  className="group flex items-center space-x-3 p-4 bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 rounded-2xl border border-orange-200/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <FaBriefcase className="text-white text-sm" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">Business Posts</div>
                    <div className="text-sm text-gray-600">Growth tips</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-800">
              <FaExclamationTriangle className="text-yellow-600" />
              <span className="text-sm font-medium">
                If you believe this is an error, please contact our support team.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
