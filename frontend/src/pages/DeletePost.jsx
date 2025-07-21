import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/userContext'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  FaTrash, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaTimes, 
  FaShieldAlt,
  FaCloudUploadAlt,
  FaCheck
} from 'react-icons/fa'

const DeletePost = ({ postId: id, className = '' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [isDeleted, setIsDeleted] = useState(false)

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
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000 // 15 seconds timeout for Cloudinary cleanup
        }
      )
      
      if (response.status === 200) {
        setIsDeleted(true)
        
        // Show success state briefly before navigation
        setTimeout(() => {
          setShowConfirm(false)
          
          // Navigate based on current location
          if (location.pathname.includes('/myposts/') || location.pathname.includes('/dashboard')) {
            window.location.reload() // Refresh to update the list
          } else if (location.pathname.includes('/posts/')) {
            navigate('/') // Go to home from post detail
          } else {
            navigate(0) // Refresh current page
          }
        }, 1000)
      }
    } catch (error) {
      console.error("Couldn't delete post:", error)
      
      // Enhanced error handling
      if (error.code === 'ECONNABORTED') {
        setError("Delete timeout. The post and images are being removed, please wait...")
      } else if (error.response?.status === 403) {
        setError("You don't have permission to delete this post.")
      } else if (error.response?.status === 404) {
        setError("Post not found. It may have already been deleted.")
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again in a few moments.")
      } else {
        setError(error.response?.data?.message || "Failed to delete post. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (!isLoading && !isDeleted) {
      setShowConfirm(false)
      setError('')
    }
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showConfirm && !isLoading && !isDeleted) {
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
  }, [showConfirm, isLoading, isDeleted])

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
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isDeleted ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {isDeleted ? (
                      <FaCheck className="text-green-500 text-xl" />
                    ) : (
                      <FaExclamationTriangle className="text-red-500 text-xl" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {isDeleted ? 'Post Deleted' : 'Delete Post'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isDeleted ? 'Successfully removed' : 'This action cannot be undone'}
                    </p>
                  </div>
                </div>
                {!isLoading && !isDeleted && (
                  <button 
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    onClick={handleCancel}
                  >
                    <FaTimes className="text-sm" />
                  </button>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 pb-6">
              {!isDeleted ? (
                <>
                  {/* Warning Message */}
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <FaShieldAlt className="text-red-500 text-lg mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-900 mb-2">Permanent Deletion</h4>
                        <p className="text-red-800 text-sm leading-relaxed">
                          Are you sure you want to delete this post? This action will permanently remove 
                          the post and its images from your blog and cannot be undone. All comments and 
                          interactions will also be lost.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cloud Storage Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <FaCloudUploadAlt className="text-blue-500 text-lg mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Cloud Storage Cleanup</h4>
                        <p className="text-blue-800 text-sm">
                          Images and media files will be permanently removed from cloud storage.
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
                </>
              ) : (
                /* Success State */
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <FaCheck className="text-green-500 text-2xl" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Post Successfully Deleted
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    The post and all associated media have been permanently removed.
                  </p>
                  <div className="inline-flex items-center space-x-2 text-green-600 text-sm font-medium">
                    <FaSpinner className="animate-spin text-xs" />
                    <span>Redirecting...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DeletePost
