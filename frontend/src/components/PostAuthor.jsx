import React, { useEffect, useState } from 'react'
import axios          from 'axios'
import { Link }       from 'react-router-dom'
import ReactTimeAgo   from 'react-time-ago'
import TimeAgo        from 'javascript-time-ago'
import en             from 'javascript-time-ago/locale/en.json'
import { FaUserCircle, FaClock, FaUser } from 'react-icons/fa'

TimeAgo.addDefaultLocale(en)

const PostAuthor = ({ authorID, createdAt, className='' }) => {
  const [author, setAuthor] = useState(null)

  /* fetch once ----------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${authorID}`
        )
        if (!cancelled) setAuthor(data)
      } catch (err) {
        console.error(err)
      }
    })()
    return () => (cancelled = true)
  }, [authorID])

  /* ---------------------------------------------------------------------- */
  const avatarSrc =
    author?.avatar
      ? `${process.env.REACT_APP_ASSETS_URL}/uploads/${author.avatar}`
      : null

  return (
    <Link 
      to={`/posts/users/${authorID}`} 
      className={`group flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 ${className}`}
    >
      {/* Avatar (with skeleton) */}
      <div className="relative flex-shrink-0">
        {!author ? (
          /* Skeleton Loading */
          <div className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse"></div>
        ) : avatarSrc ? (
          <div className="relative">
            <img 
              src={avatarSrc} 
              alt={author.name} 
              loading="lazy" 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <FaUserCircle className="text-gray-500 text-2xl" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {!author ? (
          /* Loading Skeleton */
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-24"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-16"></div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <FaUser className="text-gray-400 text-xs" />
              <h6 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
                {author.name}
              </h6>
            </div>
            <div className="flex items-center space-x-1">
              <FaClock className="text-gray-400 text-xs" />
              <small className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
              </small>
            </div>
          </div>
        )}
      </div>

      {/* Hover Arrow */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </Link>
  )
}

export default PostAuthor
