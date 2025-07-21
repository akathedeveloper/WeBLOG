import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/userContext'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaTrash, FaSpinner, FaExclamationTriangle, FaTimes, FaShieldAlt } from 'react-icons/fa'

const DeletePost = ({ postId: id, className = '' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [navigate, token])

  const handleDeleteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowConfirm(true)
    setError('')
  }

  const removePost = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        { 
          withCredentials: true, 
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      if (response.status === 200) {
        setShowConfirm(false)
        
        // Navigate based on current location
        if (location.pathname === `/myposts/${currentUser.id}`) {
          navigate(0) // Refresh current page
        } else {
          navigate('/') // Go to home
        }
      }
    } catch (error) {
      console.error("Couldn't delete post:", error)
      setError(error.response?.data?.message || "Failed to delete post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setShowConfirm(false)
    setError('')
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showConfirm) {
        handleCancel()
      }
    }

    if (showConfirm) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [showConfirm])

  return (
    <>
      {/* Delete Button */}
      <button 
        className={`group flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        onClick={handleDeleteClick}
        disabled={isLoading}
        title="Delete Post"
      >
        <FaTrash className="text-sm group-hover:animate-pulse" />
        <span>Delete</span>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleCancel}>
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full transform transition-all duration-300 scale-100" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                    <FaExclamationTriangle className="text-red-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Delete Post</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                <button 
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 pb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <FaShieldAlt className="text-red-500 text-lg mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">Permanent Deletion</h4>
                    <p className="text-red-800 text-sm leading-relaxed">
                      Are you sure you want to delete this post? This action will permanently remove 
                      the post from your blog and cannot be undone. All comments and interactions 
                      will also be lost.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <FaExclamationTriangle className="text-red-500 text-sm flex-shrink-0" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 font-semibold py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={removePost}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      <span>Delete Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DeletePost
