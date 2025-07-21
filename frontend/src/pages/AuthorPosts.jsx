import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import axios from 'axios'
import PostItem from "../components/PostItem";
import Loader from '../components/Loader'
import { 
  FaUser, 
  FaEdit, 
  FaCalendarAlt, 
  FaEye,
  FaArrowLeft,
  FaEnvelope,
  FaUserPlus,
  FaHeart,
  FaTrophy,
  FaCrown,
  FaFire,
  FaStar
} from 'react-icons/fa'
import { Link } from 'react-router-dom'

const AuthorPosts = () => {
  const [posts, setPosts] = useState([])
  const [author, setAuthor] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError('')
      
      try {
        // Fetch posts and author data simultaneously
        const [postsResponse, authorResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`),
          axios.get(`${process.env.REACT_APP_BASE_URL}/users/${id}`)
        ])
        
        setPosts(postsResponse?.data || [])
        setAuthor(authorResponse?.data || null)
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.message || 'Failed to load author data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [id])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getAuthorBadge = (postCount) => {
    if (postCount >= 50) return { 
      label: 'Expert Writer', 
      gradient: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      icon: FaCrown
    }
    if (postCount >= 20) return { 
      label: 'Veteran Author', 
      gradient: 'from-purple-400 to-violet-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      icon: FaTrophy
    }
    if (postCount >= 10) return { 
      label: 'Active Writer', 
      gradient: 'from-red-400 to-rose-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      icon: FaFire
    }
    if (postCount >= 5) return { 
      label: 'Regular Writer', 
      gradient: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      icon: FaEdit
    }
    return { 
      label: 'New Author', 
      gradient: 'from-gray-400 to-gray-500',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      icon: FaStar
    }
  }

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/20">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FaUser className="text-red-500 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
            <Link 
              to="/authors"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FaArrowLeft />
              <span>Back to Authors</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const badge = author ? getAuthorBadge(posts.length) : null
  const totalViews = posts.reduce((total, post) => total + (post.views || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-indigo-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-300/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              to="/authors"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Authors</span>
            </Link>
          </div>

          {/* Author Profile Header */}
          {author && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-12">
              
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20">
                      <img 
                        src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author.avatar}`} 
                        alt={author.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=667eea&color=fff&size=200`
                        }}
                      />
                    </div>
                    
                    {/* Badge */}
                    {badge && (
                      <div className={`absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r ${badge.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <badge.icon className="text-white text-xl" />
                      </div>
                    )}
                  </div>
                  
                  {/* Author Info */}
                  <div className="flex-1 text-center lg:text-left text-white space-y-4">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold mb-2">{author.name}</h1>
                      {badge && (
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                          <badge.icon className="text-lg" />
                          <span className="font-semibold">{badge.label}</span>
                        </div>
                      )}
                    </div>
                    
                    {author.bio && (
                      <p className="text-blue-100 text-lg max-w-2xl">{author.bio}</p>
                    )}
                    
                    {/* Meta Info */}
                    <div className="flex flex-col sm:flex-row gap-4 text-blue-100">
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-blue-300" />
                        <span>Joined {formatDate(author.createdAt)}</span>
                      </div>
                      {author.email && (
                        <div className="flex items-center space-x-2">
                          <FaEnvelope className="text-blue-300" />
                          <span>{author.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Posts Stat */}
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaEdit className="text-white text-2xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{posts.length}</h3>
                    <p className="text-gray-600 font-medium">{posts.length === 1 ? 'Post' : 'Posts'}</p>
                  </div>
                  
                  {/* Views Stat */}
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaEye className="text-white text-2xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalViews.toLocaleString()}</h3>
                    <p className="text-gray-600 font-medium">Views</p>
                  </div>
                  
                  {/* Followers Stat */}
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaHeart className="text-white text-2xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{author.followers || 0}</h3>
                    <p className="text-gray-600 font-medium">Followers</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Posts Section */}
          <div>
            {/* Posts Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {author ? `Posts by ${author.name}` : 'Author Posts'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
                </p>
              </div>
            </div>

            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {posts.map(({ _id: postId, thumbnail, category, title, description, creator, createdAt }, index) => (
                  <div 
                    key={postId}
                    className="transform transition-all duration-300"
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <PostItem 
                      postID={postId} 
                      thumbnail={thumbnail} 
                      category={category} 
                      title={title} 
                      description={description} 
                      authorID={creator} 
                      createdAt={createdAt}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* No Posts State */
              <div className="text-center py-20">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/20 max-w-2xl mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <FaEdit className="text-gray-400 text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Posts Yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {author?.name || 'This author'} hasn't published any posts yet. 
                    Check back later for amazing content!
                  </p>
                  <Link 
                    to="/authors"
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <FaUserPlus />
                    <span>Explore Other Authors</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Add animation styles if not already present
if (!document.querySelector('#author-posts-animations')) {
  const style = document.createElement('style')
  style.id = 'author-posts-animations'
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

export default AuthorPosts
