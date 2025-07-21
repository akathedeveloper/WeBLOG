import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import {
  FaTag,
  FaArrowLeft,
  FaRegClock,
  FaEdit,
  FaFire,
  FaEye,
  FaBookOpen,
  FaChartLine,
  FaFilter
} from 'react-icons/fa'
import Loader from '../components/Loader'
import PostItem from '../components/PostItem'

const CategoryPosts = () => {
  const { category } = useParams()
  const [posts, setPosts] = useState([])
  const [isLoading, setLoad] = useState(false)
  const [error, setError] = useState('')

  // Category data with colors and descriptions
  const categoryData = {
    Agriculture: { 
      icon: '🌱', 
      gradient: 'from-green-500 to-emerald-600',
      description: 'Farming, sustainability, and agricultural innovation'
    },
    Business: { 
      icon: '💼', 
      gradient: 'from-blue-500 to-blue-600',
      description: 'Entrepreneurship, strategy, and business growth'
    },
    Education: { 
      icon: '📚', 
      gradient: 'from-indigo-500 to-indigo-600',
      description: 'Learning resources and educational trends'
    },
    Entertainment: { 
      icon: '🎭', 
      gradient: 'from-purple-500 to-purple-600',
      description: 'Movies, shows, games, and entertainment'
    },
    Art: { 
      icon: '🎨', 
      gradient: 'from-pink-500 to-pink-600',
      description: 'Creative expressions and visual inspiration'
    },
    Investment: { 
      icon: '📈', 
      gradient: 'from-yellow-500 to-yellow-600',
      description: 'Financial insights and investment strategies'
    },
    Technology: { 
      icon: '💻', 
      gradient: 'from-gray-500 to-gray-600',
      description: 'Tech trends, programming, and innovation'
    },
    Travel: { 
      icon: '✈️', 
      gradient: 'from-cyan-500 to-cyan-600',
      description: 'Travel guides and adventure stories'
    },
    Health: { 
      icon: '🏥', 
      gradient: 'from-red-500 to-red-600',
      description: 'Wellness tips and healthy living'
    },
    Food: { 
      icon: '🍽️', 
      gradient: 'from-orange-500 to-orange-600',
      description: 'Recipes and culinary adventures'
    },
    Sports: { 
      icon: '⚽', 
      gradient: 'from-teal-500 to-teal-600',
      description: 'Sports news and fitness tips'
    },
    Fashion: { 
      icon: '👗', 
      gradient: 'from-rose-500 to-rose-600',
      description: 'Style trends and fashion insights'
    },
    Science: { 
      icon: '🔬', 
      gradient: 'from-violet-500 to-violet-600',
      description: 'Scientific discoveries and research'
    },
    Music: { 
      icon: '🎵', 
      gradient: 'from-emerald-500 to-emerald-600',
      description: 'Musical insights and industry trends'
    },
    Weather: { 
      icon: '🌤️', 
      gradient: 'from-sky-500 to-sky-600',
      description: 'Weather patterns and climate insights'
    },
    Uncategorized: { 
      icon: '📄', 
      gradient: 'from-gray-500 to-gray-600',
      description: 'Diverse topics and content'
    }
  }

  const currentCategory = categoryData[category] || categoryData.Uncategorized

  useEffect(() => {
    const fetch = async () => {
      setLoad(true); setError('')
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`
        )
        setPosts(data)
      } catch (err) {
        setError(
          err.response?.data?.message || 'Unable to fetch posts.'
        )
      }
      setLoad(false)
    }
    fetch()
  }, [category])

  const totalWords = posts.reduce((acc, p) => {
    const words = p.description?.replace(/<[^>]+>/g, '').trim().split(/\s+/)
    return acc + (words?.length || 0)
  }, 0)
  const readingTime = Math.max(1, Math.ceil(totalWords / 200))
  const trendingPosts = posts.filter(p => (p.views || 0) > 100).length
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0)

  if (isLoading) return <Loader />

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaTag className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              to="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FaArrowLeft />
              <span>Back Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
          <div className="mb-6">
            <Link 
              to="/"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Compact Category Header */}
          <div className="mb-10">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                
                {/* Category Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${currentCategory.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl text-white">{currentCategory.icon}</span>
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                        {category}
                      </h1>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaTag className="text-sm" />
                        <span className="font-medium">
                          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 max-w-xl">
                    {currentCategory.description}
                  </p>
                </div>

                {/* Quick Stats - Horizontal on larger screens */}
                <div className="grid grid-cols-4 lg:grid-cols-4 gap-4 lg:min-w-[400px]">
                  <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
                    <div className={`w-8 h-8 bg-gradient-to-r ${currentCategory.gradient} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <FaEdit className="text-white text-sm" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{posts.length}</h3>
                    <p className="text-xs text-gray-600 font-medium">Posts</p>
                  </div>

                  <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
                    <div className={`w-8 h-8 bg-gradient-to-r ${currentCategory.gradient} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <FaRegClock className="text-white text-sm" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{readingTime}</h3>
                    <p className="text-xs text-gray-600 font-medium">Min</p>
                  </div>

                  <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
                    <div className={`w-8 h-8 bg-gradient-to-r ${currentCategory.gradient} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <FaFire className="text-white text-sm" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{trendingPosts}</h3>
                    <p className="text-xs text-gray-600 font-medium">Hot</p>
                  </div>

                  <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
                    <div className={`w-8 h-8 bg-gradient-to-r ${currentCategory.gradient} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <FaEye className="text-white text-sm" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{totalViews > 999 ? `${Math.floor(totalViews/1000)}k` : totalViews}</h3>
                    <p className="text-xs text-gray-600 font-medium">Views</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div>
            {posts.length > 0 ? (
              <>
                {/* Section Header */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Latest in {category}
                  </h2>
                  <p className="text-gray-600">
                    Discover {posts.length} amazing {posts.length === 1 ? 'article' : 'articles'}
                  </p>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map(({ _id, thumbnail, title, description, creator, createdAt }, index) => (
                    <div 
                      key={_id}
                      className="transform transition-all duration-300"
                      style={{ 
                        animationDelay: `${index * 0.1}s`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <PostItem
                        postID={_id}
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
              </>
            ) : (
              /* No Posts State */
              <div className="text-center py-16">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-10 shadow-lg border border-white/20 max-w-xl mx-auto">
                  <div className={`w-20 h-20 bg-gradient-to-r ${currentCategory.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <span className="text-3xl text-white">{currentCategory.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No articles in {category} yet
                  </h3>
                  <p className="text-gray-600 mb-8">
                    This category is waiting for amazing content. Check back later or explore other topics!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <FaBookOpen />
                      <span>Explore All Posts</span>
                    </Link>
                    <Link 
                      to="/authors"
                      className="inline-flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
                    >
                      <FaChartLine />
                      <span>Browse Authors</span>
                    </Link>
                  </div>
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
if (!document.querySelector('#category-posts-animations')) {
  const style = document.createElement('style')
  style.id = 'category-posts-animations'
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

export default CategoryPosts
