import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import { useNavigate, useParams } from 'react-router-dom' 
import axios from 'axios'
import Loader from '../components/Loader'
import DeletePost from './DeletePost'
import { 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaCalendarAlt, 
  FaTags,
  FaChartBar,
  FaSearch,
  FaFilter,
  FaTh,
  FaList,
  FaStar,
  FaClock,
  FaArrowUp,
  FaFileAlt,
  FaUsers
} from 'react-icons/fa'

const Dashboard = () => {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, views: 0 })
  
  const navigate = useNavigate()
  const { id } = useParams()

  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token

  const categories = ['all', 'Agriculture', 'Business', 'Education', 'Entertainment', 'Art', 'Investment', 'Technology', 'Travel']

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [navigate, token])

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,
          { 
            withCredentials: true, 
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setPosts(response.data)
        setFilteredPosts(response.data)
        
        // Calculate stats
        const total = response.data.length
        const published = response.data.filter(post => post.status === 'published').length
        const drafts = total - published
        const views = response.data.reduce((acc, post) => acc + (post.views || 0), 0)
        setStats({ total, published, drafts, views })
        
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
    fetchPosts()
  }, [id, token])

  // Filter and search posts
  useEffect(() => {
    let filtered = posts

    if (filterCategory !== 'all') {
      filtered = filtered.filter(post => 
        post.category.toLowerCase() === filterCategory.toLowerCase()
      )
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, filterCategory])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const truncateText = (text, maxLength) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return formatDate(dateString)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-100/15 to-pink-100/15 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        
        {/* Dashboard Header */}
        <div className="mb-8">
          {/* Welcome Section */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Welcome back, {currentUser?.name}! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  Ready to create something amazing today?
                </p>
              </div>
              
              <Link 
                to="/create"
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-fit"
              >
                <FaPlus className="group-hover:rotate-90 transition-transform duration-200" />
                <span>Create New Post</span>
              </Link>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Posts</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-green-500 text-sm mr-1" />
                    <span className="text-green-600 text-sm font-medium">All time</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <FaFileAlt className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Published</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.published}</p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-green-500 text-sm mr-1" />
                    <span className="text-green-600 text-sm font-medium">Live posts</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <FaEye className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Drafts</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.drafts}</p>
                  <div className="flex items-center mt-2">
                    <FaClock className="text-orange-500 text-sm mr-1" />
                    <span className="text-orange-600 text-sm font-medium">In progress</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <FaEdit className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.views.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <FaUsers className="text-purple-500 text-sm mr-1" />
                    <span className="text-purple-600 text-sm font-medium">Readers</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <FaChartBar className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {posts.length > 0 ? (
          <>
            {/* Controls */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  {/* Category Filter */}
                  <div className="relative">
                    <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="pl-12 pr-8 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 min-w-48"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* View Toggle */}
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      className={`p-3 rounded-lg transition-all duration-200 ${
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
                      className={`p-3 rounded-lg transition-all duration-200 ${
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

              {/* Results Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Showing <span className="font-semibold text-gray-900">{filteredPosts.length}</span> of <span className="font-semibold text-gray-900">{posts.length}</span> posts
                  {searchTerm && (
                    <span className="ml-1">
                      for "<span className="font-semibold text-blue-600">{searchTerm}</span>"
                    </span>
                  )}
                  {filterCategory !== 'all' && (
                    <span className="ml-1">
                      in <span className="font-semibold text-indigo-600">{filterCategory}</span>
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Posts Grid/List */}
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' 
                : 'space-y-6'
            }`}>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <article 
                    key={post._id} 
                    className={`group bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 ${
                      viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Thumbnail */}
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'md:w-80 md:flex-shrink-0' : 'aspect-video'
                    }`}>
                      <img 
                        src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMzAgMTAwSDEwNlYxMDZIMTMwVjEwMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTEwNiAxMDBIMTMwVjEyNEgxMDZWMTAwWiIgZmlsbD0iIzlDQTRBRiIvPgo8L3N2Zz4='
                        }}
                      />
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          (post.status || 'published') === 'published' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-orange-500 text-white'
                        }`}>
                          {post.status || 'Published'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Meta */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <FaTags className="text-blue-500" />
                          <span>{post.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaCalendarAlt className="text-gray-400" />
                          <span>{getTimeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      {/* Description (List view only) */}
                      {viewMode === 'list' && (
                        <p className="text-gray-600 mb-4 flex-grow">
                          {truncateText(post.description || '', 120)}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                        <Link 
                          to={`/posts/${post._id}`} 
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                        >
                          <FaEye />
                          <span>View</span>
                        </Link>
                        <Link 
                          to={`/posts/${post._id}/edit`} 
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
                        >
                          <FaEdit />
                          <span>Edit</span>
                        </Link>
                        <DeletePost postId={post._id} />
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
                    <FaSearch className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts found</h3>
                  <p className="text-gray-600 text-center mb-6 max-w-md">
                    We couldn't find any posts matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchTerm('')
                      setFilterCategory('all')
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mb-8">
              <FaEdit className="text-blue-500 text-5xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Writing Journey</h2>
            <p className="text-gray-600 text-center text-lg mb-8 max-w-md">
              You haven't created any posts yet. Share your thoughts and stories with the world!
            </p>
            <Link 
              to="/create"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FaPlus />
              <span>Create Your First Post</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
