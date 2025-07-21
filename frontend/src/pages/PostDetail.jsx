import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Loader from '../components/Loader'
import DeletePost from './DeletePost'
import PostAuthor from '../components/PostAuthor'
import { UserContext } from '../context/userContext'
import { 
  FaEdit, 
  FaTrash, 
  FaClock, 
  FaTag, 
  FaArrowLeft, 
  FaShareAlt,
  FaBookmark,
  FaHeart,
  FaComment,
  FaEye
} from 'react-icons/fa'

const PostDetail = () => {
  const { id } = useParams()
  const { currentUser } = useContext(UserContext)
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`
        )
        setPost(data)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPost()
  }, [id])

  // Helper function to handle image URLs (backward compatibility)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/api/placeholder/800/400'
    
    // If it's already a full URL (Cloudinary), use it directly
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    
    // Fallback for old local images
    return `${process.env.REACT_APP_ASSETS_URL}/uploads/${imagePath}`
  }

  const getReadingTime = (html) => {
    const text = html.replace(/<[^>]+>/g, '').trim()
    const words = text.split(/\s+/).length
    return Math.max(1, Math.ceil(words / 200))
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Agriculture': 'from-green-500 to-emerald-600',
      'Business': 'from-blue-500 to-blue-600',
      'Education': 'from-indigo-500 to-indigo-600',
      'Entertainment': 'from-purple-500 to-purple-600',
      'Art': 'from-pink-500 to-pink-600',
      'Investment': 'from-yellow-500 to-yellow-600',
      'Technology': 'from-gray-500 to-gray-600',
      'Travel': 'from-cyan-500 to-cyan-600',
      'Health': 'from-red-500 to-red-600',
      'Food': 'from-orange-500 to-orange-600',
      'Sports': 'from-teal-500 to-teal-600',
      'Fashion': 'from-rose-500 to-rose-600',
      'Science': 'from-violet-500 to-violet-600',
      'Music': 'from-emerald-500 to-emerald-600',
      'Weather': 'from-sky-500 to-sky-600',
      'Uncategorized': 'from-gray-500 to-gray-600'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: `Check out this article: ${post.title}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  if (isLoading) return <Loader />
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaEye className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              to="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FaArrowLeft />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    post && (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-indigo-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-300/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative pt-24 pb-16">
          
          {/* Back Navigation */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <Link 
              to="/"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Posts</span>
            </Link>
          </div>

          {/* Main Content */}
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <header className="mb-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
                
                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <PostAuthor
                    authorID={post.creator}
                    createdAt={post.createdAt}
                  />
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaClock className="text-sm" />
                    <span className="text-sm font-medium">{getReadingTime(post.description)} min read</span>
                  </div>
                  
                  <div className={`flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${getCategoryColor(post.category)} text-white rounded-full text-sm font-semibold`}>
                    <FaTag className="text-xs" />
                    <span>{post.category}</span>
                  </div>

                  {/* Views Count (if available) */}
                  {post.views !== undefined && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaEye className="text-sm" />
                      <span className="text-sm font-medium">{post.views.toLocaleString()} views</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  
                  {/* Author Actions */}
                  {currentUser?.id === post.creator && (
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/posts/${id}/edit`}
                        className="inline-flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <FaEdit className="text-sm" />
                        <span>Edit</span>
                      </Link>
                      <DeletePost postId={id} />
                    </div>
                  )}

                  {/* Reader Actions */}
                  <div className="flex items-center space-x-3">
                    <button 
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 rounded-lg font-medium transition-colors duration-200"
                      onClick={() => {
                        // Add like functionality here
                        console.log('Like clicked')
                      }}
                    >
                      <FaHeart className="text-sm" />
                      <span>Like</span>
                    </button>
                    <button 
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 rounded-lg font-medium transition-colors duration-200"
                      onClick={() => {
                        // Add bookmark functionality here
                        console.log('Bookmark clicked')
                      }}
                    >
                      <FaBookmark className="text-sm" />
                      <span>Save</span>
                    </button>
                    <button 
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 rounded-lg font-medium transition-colors duration-200"
                      onClick={handleShare}
                    >
                      <FaShareAlt className="text-sm" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="mb-12">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={getImageUrl(post.thumbnail)}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/800/400'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>

            {/* Article Content */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-xl border border-white/20 mb-12">
              <div
                className="prose prose-lg md:prose-xl max-w-none"
                dangerouslySetInnerHTML={{ __html: post.description }}
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.8',
                  color: '#374151'
                }}
              />
            </div>

            {/* Engagement Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Enjoyed this article?
                  </h3>
                  <p className="text-gray-600">
                    Share your thoughts and connect with other readers
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
                    onClick={() => {
                      // Add like functionality here
                      console.log('Like post clicked')
                    }}
                  >
                    <FaHeart />
                    <span>Like Post</span>
                  </button>
                  <button 
                    className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
                    onClick={() => {
                      // Add comment functionality here
                      console.log('Comment clicked')
                    }}
                  >
                    <FaComment />
                    <span>Comment</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    )
  )
}

export default PostDetail
