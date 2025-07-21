import React from 'react'
import { FaFeather, FaSpinner } from 'react-icons/fa'

const Loader = ({ 
  size = 'default', 
  variant = 'page', 
  message = 'Loading...',
  showBrand = true 
}) => {
  
  // Size variants
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-12 h-12', 
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  }

  // For inline/button loading
  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-2">
        <FaSpinner className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        {message && <span className="text-gray-600 text-sm">{message}</span>}
      </div>
    )
  }

  // For component-level loading
  if (variant === 'component') {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        {message && (
          <p className="text-gray-600 text-sm font-medium animate-pulse">{message}</p>
        )}
      </div>
    )
  }

  // Full page loading (default)
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center z-50">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/15 to-pink-300/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-200/10 to-blue-300/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Loader Container */}
      <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
        
        {/* Animated Logo */}
        {showBrand && (
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
                <FaFeather className="text-white text-2xl" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-indigo-600/30 rounded-full blur animate-ping"></div>
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                WeBlog
              </h2>
              <p className="text-blue-600 text-sm font-medium opacity-75">
                Crafting Stories
              </p>
            </div>
          </div>
        )}

        {/* Advanced Spinner */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
          
          {/* Inner Ring */}
          <div className="absolute top-2 left-2 w-16 h-16 border-4 border-transparent border-t-blue-600 border-r-blue-600 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          
          {/* Center Dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-gray-900 animate-pulse">
            {message}
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Progress Hint */}
        <p className="text-gray-500 text-sm max-w-md text-center leading-relaxed">
          Preparing your content experience...
        </p>
      </div>
    </div>
  )
}

export default Loader
