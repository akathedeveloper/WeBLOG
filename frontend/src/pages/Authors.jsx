import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Loader from '../components/Loader'
import { 
  FaSearch, 
  FaUser, 
  FaEdit, 
  FaUsers, 
  FaSort,
  FaUserPlus,
  FaCrown,
  FaAward,
  FaFire,
  FaTimes,
  FaEye,
  FaBookmark,
  FaStar,
  FaTrophy,
  FaExclamationTriangle,
  FaCloudUploadAlt
} from 'react-icons/fa'

const Authors = () => {
  const [authors, setAuthors] = useState([])
  const [filteredAuthors, setFilteredAuthors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')

  // Helper function to handle avatar URLs (backward compatibility)
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null
    
    // If it's already a full URL (Cloudinary), use it directly
    if (avatarPath.startsWith('http')) {
      return avatarPath
    }
    
    // Fallback for old local avatars
    return `${process.env.REACT_APP_ASSETS_URL}/uploads/${avatarPath}`
  }

  useEffect(() => { 
    const getAuthors = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`, {
          timeout: 10000 // 10 second timeout
        })
        setAuthors(response.data)
        setFilteredAuthors(response.data)
      } 
      catch (error) {
        console.error('Error fetching authors:', error)
        if (error.code === 'ECONNABORTED') {
          setError('Request timeout. Please check your connection and try again.')
        } else {
          setError(error.response?.data?.message || 'Failed to load authors. Please try again.')
        }
      }
      setIsLoading(false)   
    } 
    getAuthors()
  }, [])

  // Filter and sort authors
  useEffect(() => {
    let filtered = [...authors]

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(author =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort authors
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'posts':
        filtered.sort((a, b) => b.posts - a.posts)
        break
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      default:
        break
    }

    setFilteredAuthors(filtered)
  }, [authors, searchTerm, sortBy])

  const getAuthorBadge = (posts) => {
    if (posts >= 50) return { 
      icon: FaCrown, 
      label: 'Expert Writer', 
      gradient: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    }
    if (posts >= 20) return { 
      icon: FaTrophy, 
      label: 'Veteran Author', 
      gradient: 'from-purple-400 to-violet-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700'
    }
    if (posts >= 10) return { 
      icon: FaFire, 
      label: 'Active Writer', 
      gradient: 'from-red-400 to-rose-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700'
    }
    if (posts >= 5) return { 
      icon: FaEdit, 
      label: 'Regular Writer', 
      gradient: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    }
    return { 
      icon: FaUserPlus, 
      label: 'New Author', 
      gradient: 'from-gray-400 to-gray-500',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700'
    }
  }

  const getTopAuthors = () => {
    return [...authors]
      .sort((a, b) => b.posts - a.posts)
      .slice(0, 3)
  }

  const handleRetry = () => {
    setError('')
    window.location.reload()
  }

  if (isLoading) {
    return <Loader message="Loading amazing authors..." />
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/20">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-red-500 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Unable to Load Authors</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleRetry}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FaCloudUploadAlt />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const topAuthors = getTopAuthors()
  const totalPosts = authors.reduce((total, author) => total + author.posts, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-indigo-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-300/10 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <FaUsers className="text-blue-600 text-xl" />
                <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">Community</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Meet Our{' '}
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Authors
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover the talented writers behind our amazing content and connect with creative minds from around the world
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
              <div className="flex items-center space-x-4 px-6 py-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FaUsers className="text-white text-xl" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-900">{authors.length}</h3>
                  <p className="text-gray-600 font-medium">Authors</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 px-6 py-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <FaEdit className="text-white text-xl" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-900">{totalPosts}</h3>
                  <p className="text-gray-600 font-medium">Posts</p>
                </div>
              </div>
            </div>
          </div>

          {authors.length > 0 ? (
            <>
              {/* Top Authors Spotlight */}
              {topAuthors.length > 0 && (
                <div className="mb-20">
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <FaCrown className="text-yellow-500 text-xl" />
                      <span className="text-yellow-600 font-semibold uppercase tracking-wider text-sm">Hall of Fame</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Top Contributors</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {topAuthors.map((author, index) => {
                      const badge = getAuthorBadge(author.posts)
                      const avatarUrl = getAvatarUrl(author.avatar)
                      
                      return (
                        <Link 
                          key={author._id} 
                          to={`/posts/users/${author._id}`} 
                          className={`group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center min-h-[320px] flex flex-col justify-between ${
                            index === 0 ? 'md:scale-105' : ''
                          }`}
                        >
                          {/* Rank Badge */}
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg ${
                              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 
                              index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' : 
                              'bg-gradient-to-r from-amber-600 to-yellow-700'
                            }`}>
                              <span className="text-white font-bold">#{index + 1}</span>
                            </div>
                          </div>

                          <div>
                            {/* Avatar */}
                            <div className="relative mb-4 mt-2">
                              <div className={`w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-lg ring-3 ${
                                index === 0 ? 'ring-yellow-400' : 
                                index === 1 ? 'ring-gray-400' : 
                                'ring-amber-600'
                              } group-hover:scale-105 transition-transform duration-300`}>
                                {avatarUrl ? (
                                  <img 
                                    src={avatarUrl} 
                                    alt={author.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=667eea&color=fff&size=200`
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                    <FaUser className="text-gray-500 text-2xl" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Badge Icon */}
                              <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${badge.gradient} rounded-lg flex items-center justify-center shadow-md`}>
                                <badge.icon className="text-white text-xs" />
                              </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-2">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {author.name}
                              </h3>
                              <p className="text-xl font-bold text-blue-600">
                                {author.posts} posts
                              </p>
                            </div>
                          </div>

                          {/* Badge */}
                          <div className={`inline-flex items-center space-x-2 px-3 py-1.5 ${badge.bgColor} rounded-full mt-4`}>
                            <badge.icon className={`text-xs ${badge.textColor}`} />
                            <span className={`text-xs font-semibold ${badge.textColor}`}>
                              {badge.label}
                            </span>
                          </div>

                          {/* Hover Effect */}
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Search and Sort Controls */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 mb-12">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-lg">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search authors by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                    {searchTerm && (
                      <button 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setSearchTerm('')}
                        aria-label="Clear search"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>

                  {/* Sort Control */}
                  <div className="flex items-center space-x-3">
                    <FaSort className="text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3.5 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 min-w-[160px]"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="posts">Sort by Posts</option>
                      <option value="recent">Sort by Recent</option>
                    </select>
                  </div>
                </div>

                {/* Results Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-700 font-medium">
                    Showing <span className="font-bold text-gray-900">{filteredAuthors.length}</span> of <span className="font-bold text-gray-900">{authors.length}</span> authors
                    {searchTerm && (
                      <span className="ml-1">
                        for "<span className="font-bold text-blue-600">{searchTerm}</span>"
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* All Authors Grid */}
              <div>
                <div className="flex items-center space-x-3 mb-8">
                  <FaUsers className="text-blue-600 text-2xl" />
                  <h2 className="text-3xl font-bold text-gray-900">All Authors</h2>
                </div>
                
                {filteredAuthors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {filteredAuthors.map((author, index) => {
                      const badge = getAuthorBadge(author.posts)
                      const avatarUrl = getAvatarUrl(author.avatar)
                      
                      return (
                        <Link 
                          key={author._id} 
                          to={`/posts/users/${author._id}`} 
                          className="group bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center min-h-[280px] flex flex-col justify-between"
                          style={{ 
                            animationDelay: `${index * 0.05}s`,
                            animation: 'fadeInUp 0.6s ease-out forwards'
                          }}
                        >
                          <div>
                            {/* Avatar */}
                            <div className="relative mb-4">
                              <div className="w-16 h-16 mx-auto rounded-xl overflow-hidden shadow-md ring-2 ring-gray-200 group-hover:ring-blue-400 group-hover:scale-105 transition-all duration-300">
                                {avatarUrl ? (
                                  <img 
                                    src={avatarUrl} 
                                    alt={author.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=667eea&color=fff&size=150`
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                    <FaUser className="text-gray-500 text-xl" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Online Status */}
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                            </div>

                            {/* Info */}
                            <div className="space-y-2">
                              <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {author.name}
                              </h4>
                              <p className="text-gray-600 font-medium text-sm">
                                {author.posts} {author.posts === 1 ? 'post' : 'posts'}
                              </p>
                            </div>
                          </div>

                          {/* Badge */}
                          <div className={`inline-flex items-center space-x-1 px-2.5 py-1 ${badge.bgColor} rounded-full mt-3`}>
                            <badge.icon className={`text-xs ${badge.textColor}`} />
                            <span className={`text-xs font-medium ${badge.textColor}`}>
                              {badge.label}
                            </span>
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                            <div className="flex items-center space-x-2 text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <FaEye className="text-sm" />
                              <span className="text-sm">View Posts</span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  /* No Results */
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <FaSearch className="text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">No authors found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Try adjusting your search criteria to find the authors you're looking for.
                    </p>
                    <button 
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <FaUsers className="text-blue-500 text-4xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">No Authors Yet</h2>
              <p className="text-xl text-gray-600 max-w-md mx-auto mb-8">
                Be the first to join our community of writers and share your stories with the world!
              </p>
              <Link 
                to="/register"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FaUserPlus />
                <span>Join Our Community</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Add animation styles if not already present
if (!document.querySelector('#authors-animations')) {
  const style = document.createElement('style')
  style.id = 'authors-animations'
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .line-clamp-1 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  `
  document.head.appendChild(style)
}

export default Authors
