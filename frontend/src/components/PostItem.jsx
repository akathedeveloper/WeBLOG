import React from 'react'
import { Link } from 'react-router-dom'
import { FaRegClock, FaArrowRight, FaEye, FaBookmark } from 'react-icons/fa'
import PostAuthor from './PostAuthor'

const PostItem = ({
  postID,
  category,
  title,
  description,
  authorID,
  thumbnail,
  createdAt,
  viewMode = 'grid' // Add support for different view modes
}) => {
  /* --- helpers ---------------------------------------------------------- */
  const stripTags = html => html.replace(/<[^>]*>?/gm, '')
  const shortDesc = stripTags(description).slice(0, 140) + (description.length > 140 ? '…' : '')
  const shortTitle = title.length > 60 ? title.slice(0, 57) + '…' : title
  const readMinutes = Math.max(1, Math.ceil(stripTags(description).split(/\s+/).length / 200))

  // Helper function to handle image URLs (backward compatibility)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.svg'
    
    // If it's already a full URL (Cloudinary), use it directly
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    
    // Fallback for old local images
    return `${process.env.REACT_APP_ASSETS_URL}/uploads/${imagePath}`
  }

  // Category colors
  const getCategoryColor = (category) => {
    const colors = {
      'Agriculture': 'from-green-500 to-green-600',
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
      'Music': 'from-emerald-500 to-emerald-600'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  /* ---------------------------------------------------------------------- */
  if (viewMode === 'list') {
    return (
      <article className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail */}
          <Link to={`/posts/${postID}`} className="relative block md:w-80 md:flex-shrink-0">
            <div className="aspect-video md:aspect-square md:h-full relative overflow-hidden">
              <img
                src={getImageUrl(thumbnail)}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => (e.currentTarget.src = '/placeholder.svg')}
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(category)} text-white text-xs font-semibold rounded-full shadow-lg`}>
                  {category}
                </span>
              </div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Title */}
              <Link to={`/posts/${postID}`}>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
                  {shortTitle}
                </h3>
              </Link>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed line-clamp-3">
                {shortDesc}
              </p>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 mt-4 border-t border-gray-100">
              <PostAuthor authorID={authorID} createdAt={createdAt} />
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <FaRegClock className="text-xs" />
                  <span>{readMinutes} min read</span>
                </div>
                <Link 
                  to={`/posts/${postID}`}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                >
                  <span>Read more</span>
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }

  // Grid view (default)
  return (
    <article className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      {/* Thumbnail */}
      <Link to={`/posts/${postID}`} className="relative block">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={getImageUrl(thumbnail)}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => (e.currentTarget.src = '/placeholder.svg')}
          />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1.5 bg-gradient-to-r ${getCategoryColor(category)} text-white text-xs font-semibold rounded-full shadow-lg transform group-hover:scale-105 transition-transform duration-200`}>
              {category}
            </span>
          </div>

          {/* Read Time Badge */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-1 px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full">
              <FaRegClock />
              <span>{readMinutes} min</span>
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Hover Actions */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center space-x-3">
              <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors duration-200 transform hover:scale-110">
                <FaEye className="text-lg" />
              </button>
              <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-red-500 transition-colors duration-200 transform hover:scale-110">
                <FaBookmark className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Content Body */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <Link to={`/posts/${postID}`}>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
            {shortTitle}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed line-clamp-3 text-sm">
          {shortDesc}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <PostAuthor authorID={authorID} createdAt={createdAt} className="flex-1" />
          
          <Link 
            to={`/posts/${postID}`}
            className="group/btn flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-all duration-200 hover:translate-x-1"
          >
            <span>Read</span>
            <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default PostItem
