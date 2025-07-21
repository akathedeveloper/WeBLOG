import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import PostItem from '../components/PostItem'
import Loader from '../components/Loader'
import { 
  FaSearch, 
  FaFilter, 
  FaTh, 
  FaList, 
  FaSort,
  FaCalendarAlt,
  FaFire,
  FaClock,
  FaEye,
  FaTags,
  FaUser,
  FaHeart,
  FaComment,
  FaShare,
  FaTimes,
  FaChevronDown,
  FaBookmark,
  FaArrowLeft
} from 'react-icons/fa'

const AllPosts = () => {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    'all', 'Agriculture', 'Business', 'Education', 'Entertainment', 
    'Art', 'Investment', 'Technology', 'Travel', 'Health', 'Food', 
    'Sports', 'Fashion', 'Science', 'Music'
  ]

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts`)
        setPosts(response?.data || [])
        setFilteredPosts(response?.data || [])
      } catch (err) {
        console.log(err)
        setPosts([])
        setFilteredPosts([])
      }
      setIsLoading(false)
    }
    fetchPosts()
  }, [])

  // Filter and sort posts
  useEffect(() => {
    let filtered = [...posts]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => 
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort posts
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category))
        break
      default:
        break
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, selectedCategory, sortBy])

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSortBy('newest')
    setShowFilters(false)
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Agriculture': '🌱',
      'Business': '💼',
      'Education': '📚',
      'Entertainment': '🎭',
      'Art': '🎨',
      'Investment': '📈',
      'Technology': '💻',
      'Travel': '✈️',
      'Health': '🏥',
      'Food': '🍽️',
      'Sports': '⚽',
      'Fashion': '👗',
      'Science': '🔬',
      'Music': '🎵'
    }
    return icons[category] || '📄'
  }

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

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-20">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-indigo-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-300/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FaBookmark className="text-blue-600 text-xl" />
              <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">All Stories</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Discover All{' '}
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Stories
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our complete collection of stories, insights, and perspectives from our amazing community
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
              <FaEye className="text-blue-600" />
              <span className="font-semibold text-gray-900">{posts.length} Posts</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-lg">
              <FaFire className="animate-pulse" />
              <span className="font-semibold">All Categories</span>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 mb-8">
          
          {/* Main Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search posts, categories, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-lg"
              />
              {searchTerm && (
                <button 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10 w-6 h-6 flex items-center justify-center"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-4">
              {/* Filter Toggle */}
              <button 
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                  showFilters 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter />
                <span>Filters</span>
                <FaChevronDown className={`transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <FaTh />
                </button>
                <button
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Filters */}
          <div className={`overflow-hidden transition-all duration-300 ${
            showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="pt-6 border-t border-gray-200 space-y-6">
              
              {/* Category Filter */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FaTags className="text-blue-600" />
                  <label className="font-semibold text-gray-900 text-lg">Categories</label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        selectedCategory === category
                          ? `bg-gradient-to-r ${category !== 'all' ? getCategoryColor(category) : 'from-blue-600 to-indigo-600'} text-white shadow-lg transform scale-105`
                          : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category !== 'all' && (
                        <span className="text-lg">{getCategoryIcon(category)}</span>
                      )}
                      <span>{category === 'all' ? 'All Categories' : category}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FaSort className="text-blue-600" />
                  <label className="font-semibold text-gray-900 text-lg">Sort By</label>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      sortBy === 'newest' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                    onClick={() => setSortBy('newest')}
                  >
                    <FaClock />
                    <span>Newest First</span>
                  </button>
                  <button
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      sortBy === 'oldest' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                    onClick={() => setSortBy('oldest')}
                  >
                    <FaCalendarAlt />
                    <span>Oldest First</span>
                  </button>
                  <button
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      sortBy === 'title' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                    onClick={() => setSortBy('title')}
                  >
                    <span>A-Z</span>
                  </button>
                  <button
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      sortBy === 'category' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                    onClick={() => setSortBy('category')}
                  >
                    <FaTags />
                    <span>Category</span>
                  </button>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedCategory !== 'all' || sortBy !== 'newest') && (
                <div className="pt-4 border-t border-gray-200">
                  <button 
                    className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-medium hover:bg-red-100 transition-colors duration-200 flex items-center space-x-2"
                    onClick={handleClearFilters}
                  >
                    <FaTimes />
                    <span>Clear All Filters</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <p className="text-gray-700 font-medium">
              {filteredPosts.length === posts.length ? (
                <>Showing all <span className="font-bold text-gray-900">{posts.length}</span> posts</>
              ) : (
                <>Showing <span className="font-bold text-gray-900">{filteredPosts.length}</span> of <span className="font-bold text-gray-900">{posts.length}</span> posts</>
              )}
              {searchTerm && (
                <span className="ml-1">
                  for "<span className="font-bold text-blue-600">{searchTerm}</span>"
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="ml-1">
                  in <span className="font-bold text-indigo-600">{selectedCategory}</span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' 
              : 'space-y-8'
          }`}>
            {filteredPosts.map(({ _id: id, thumbnail, category, title, description, creator, createdAt }, index) => (
              <div 
                key={id}
                className={`transform transition-all duration-300 hover:-translate-y-2 ${
                  viewMode === 'grid' ? '' : 'w-full'
                }`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <PostItem 
                  postID={id} 
                  thumbnail={thumbnail} 
                  category={category} 
                  title={title} 
                  description={description} 
                  authorID={creator} 
                  createdAt={createdAt}
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">
                {searchTerm || selectedCategory !== 'all' ? '🔍' : '📝'}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {searchTerm || selectedCategory !== 'all' ? 'No posts found' : 'No posts available'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'Be the first to share your story with the community!'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button 
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Add animation styles if not already present
if (!document.querySelector('#all-posts-animations')) {
  const style = document.createElement('style')
  style.id = 'all-posts-animations'
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
  `
  document.head.appendChild(style)
}

export default AllPosts
