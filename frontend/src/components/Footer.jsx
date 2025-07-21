import React from 'react'
import { Link } from "react-router-dom"
import { FaFeather, FaHeart, FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa'

const Footer = () => {
    const categories = [
        { name: 'Agriculture', icon: '🌱' },
        { name: 'Business', icon: '💼' },
        { name: 'Education', icon: '📚' },
        { name: 'Entertainment', icon: '🎭' },
        { name: 'Art', icon: '🎨' },
        { name: 'Investment', icon: '📈' },
        { name: 'Technology', icon: '💻' },
        { name: 'Travel', icon: '✈️' },
        { name: 'Health', icon: '🏥' },
        { name: 'Food', icon: '🍽️' },
        { name: 'Sports', icon: '⚽' },
        { name: 'Fashion', icon: '👗' }
    ]

    const quickLinks = [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' }
    ]

    return (
        <footer className="relative bg-gradient-to-br from-gray-50 to-slate-100 border-t border-gray-200/60">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-100/30 to-indigo-100/30 rounded-full blur-3xl transform -translate-y-32"></div>
                <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-100/25 to-pink-100/25 rounded-full blur-2xl transform translate-y-24"></div>
            </div>

            <div className="relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
                        
                        {/* Brand Section */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Logo */}
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <FaFeather className="text-white text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">WeBlog</h3>
                                    <p className="text-sm text-gray-600 font-medium">Where stories come to life</p>
                                </div>
                            </div>
                            
                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed">
                                Join our community of writers and readers. Share your thoughts, 
                                discover amazing stories, and connect with people who share your passions.
                            </p>
                            
                            {/* Social Links */}
                            <div className="flex space-x-4">
                                <a 
                                    href="#" 
                                    className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                                    aria-label="Twitter"
                                >
                                    <FaTwitter className="text-lg" />
                                </a>
                                <a 
                                    href="#" 
                                    className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:text-blue-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                                    aria-label="LinkedIn"
                                >
                                    <FaLinkedin className="text-lg" />
                                </a>
                                <a 
                                    href="#" 
                                    className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:text-pink-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                                    aria-label="Instagram"
                                >
                                    <FaInstagram className="text-lg" />
                                </a>
                                <a 
                                    href="#" 
                                    className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                                    aria-label="GitHub"
                                >
                                    <FaGithub className="text-lg" />
                                </a>
                            </div>
                        </div>

                        {/* Categories Section */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-gray-900">Categories</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {categories.map((category, index) => (
                                    <Link
                                        key={index}
                                        to={`/posts/categories/${category.name}`}
                                        className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 group"
                                    >
                                        <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                                            {category.icon}
                                        </span>
                                        <span className="text-sm font-medium">{category.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links Section */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-gray-900">Quick Links</h4>
                            <ul className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm font-medium hover:translate-x-1 transform inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter Section */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-gray-900">Newsletter</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Subscribe to get the latest posts and updates.
                            </p>
                            <form className="space-y-3">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email"
                                        className="flex-1 px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                                    />
                                    <button 
                                        type="submit"
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="pt-8 border-t border-gray-200/60">
                        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                            
                            {/* Copyright */}
                            <div className="text-center sm:text-left">
                                <p className="text-sm text-gray-600 flex items-center justify-center sm:justify-start space-x-1">
                                    <span>Made with</span>
                                    <FaHeart className="text-red-500 text-sm animate-pulse" />
                                    <span>Adhiraj Singh</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    &copy; {new Date().getFullYear()} WeBlog. All Rights Reserved.
                                </p>
                            </div>

                            {/* Back to Top Button */}
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center text-lg font-bold"
                                aria-label="Back to top"
                            >
                                ↑
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
