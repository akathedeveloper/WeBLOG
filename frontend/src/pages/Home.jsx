import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaArrowDown, 
  FaFeather, 
  FaStar, 
  FaUsers, 
  FaBookmark, 
  FaArrowRight, 
  FaChartLine, // Using FaChartLine instead of FaTrendingUp
  FaRocket, 
  FaHeart 
} from 'react-icons/fa'
import Posts from '../components/Posts'

const trendingCategories = [
  { name: 'Business', icon: '💼', color: 'from-blue-500 to-blue-600' },
  { name: 'Technology', icon: '💻', color: 'from-indigo-500 to-indigo-600' },
  { name: 'Education', icon: '📚', color: 'from-green-500 to-green-600' },
  { name: 'Art', icon: '🎨', color: 'from-purple-500 to-purple-600' },
  { name: 'Travel', icon: '✈️', color: 'from-cyan-500 to-cyan-600' },
  { name: 'Food', icon: '🍽️', color: 'from-orange-500 to-orange-600' },
  { name: 'Health', icon: '🏥', color: 'from-pink-500 to-pink-600' }
]

const stats = [
  { number: '12+', label: 'Contributors', icon: FaUsers },
  { number: '85+', label: 'Published Posts', icon: FaBookmark },
  { number: '1.2K+', label: 'Preview Views', icon: FaHeart },
  { number: '16', label: 'Features Built', icon: FaStar }
]



const Home = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/15 to-pink-300/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-200/10 to-blue-300/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Logo Animation */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                  <FaFeather className="text-white text-3xl animate-bounce" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-full blur animate-ping"></div>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent block">
                Welcome to
              </span>
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block mt-2">
                WeBlog
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              The ultimate platform for writers and readers. Create compelling stories, 
              discover amazing content, and connect with a global community of storytellers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <a 
                href="#posts" 
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-10 py-5 rounded-2xl transition-all duration-300 flex items-center space-x-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 text-lg"
              >
                <span>Explore Stories</span>
                <FaArrowDown className="group-hover:translate-y-1 transition-transform duration-300" />
              </a>
              
              <Link 
                to="/register" 
                className="group bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 font-semibold px-10 py-5 rounded-2xl transition-all duration-300 flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-gray-200/50 text-lg"
              >
                <span>Start Writing</span>
                <FaRocket className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className={`text-center transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="flex justify-center mb-3">
                    <stat.icon className="text-blue-600 text-2xl" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* TRENDING CATEGORIES */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FaChartLine className="text-blue-600 text-xl" />
              <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">Trending Now</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Popular Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover stories across diverse topics and find your next favorite read
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 lg:gap-6">
            {trendingCategories.map((category, index) => (
              <Link
                key={category.name}
                to={`/posts/categories/${category.name}`}
                className={`group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center overflow-hidden`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : ''
                }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                
                {/* Category Name */}
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {category.name}
                </h3>
                
                {/* Hover Arrow */}
                <FaArrowRight className="absolute top-4 right-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CONTENT SECTION */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Content */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <FaStar className="text-yellow-500 text-xl" />
                <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">Why Choose WeBlog</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your Stories Deserve a Beautiful Home
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                WeBlog provides powerful tools, beautiful templates, and a supportive community 
                to help you share your voice with the world. Join thousands of writers who've 
                already made WeBlog their creative home.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Professional writing tools and editor',
                  'Beautiful, responsive post templates',
                  'SEO optimization and analytics',
                  'Engaged community of readers'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link 
                to="/register"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <span>Get Started Free</span>
                <FaArrowRight />
              </Link>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="space-y-6">
                  {/* Mock Editor Interface */}
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-500 text-sm ml-4">WeBlog Editor</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-8 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Your Story Here</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                <FaFeather className="text-white text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST POSTS */}
      <section id="posts" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          

          {/* Posts Component */}
          <Posts />
          
          {/* View All Posts Button */}
          <div className="text-center mt-12">
            <Link 
              to="/posts"
              className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border border-gray-200/50"
            >
              <span>View All Posts</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of writers who are already using WeBlog to share their stories with the world.
          </p>
          <Link 
            to="/register"
            className="inline-flex items-center space-x-3 bg-white hover:bg-gray-50 text-blue-600 font-bold px-10 py-5 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 text-lg"
          >
            <span>Get Started Today</span>
            <FaRocket />
          </Link>
        </div>
      </section>
    </div>
  )
}

// Add this CSS for the fadeInUp animation (only if not already present)
if (!document.querySelector('#fade-in-up-styles')) {
  const style = document.createElement('style')
  style.id = 'fade-in-up-styles'
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

export default Home
