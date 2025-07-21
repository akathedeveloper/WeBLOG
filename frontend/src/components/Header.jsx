import React, { useState, useContext, useEffect } from 'react'
import { Link, useLocation } from "react-router-dom"
import { FaBars, FaFeather, FaUser, FaEdit, FaUsers, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'
import { UserContext } from '../context/userContext'

const Header = () => {
    const [isNavShowing, setIsNavShowing] = useState(window.innerWidth > 800)
    const [isScrolled, setIsScrolled] = useState(false)
    const { currentUser } = useContext(UserContext)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setIsNavShowing(window.innerWidth > 800)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const closeNavHandler = () => {
        if (window.innerWidth < 800) {
            setIsNavShowing(false)
        }
    }

    const isActiveLink = (path) => {
        return location.pathname === path
    }

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
                isScrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/60' 
                    : 'bg-white/90 backdrop-blur-sm'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        
                        {/* Logo */}
                        <Link 
                            to="/" 
                            className="flex items-center space-x-3 hover:opacity-80 transition-opacity" 
                            onClick={closeNavHandler}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                                    <FaFeather className="text-white text-lg" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <h3 className="text-xl font-bold text-gray-900">WeBlog</h3>
                                <span className="text-xs text-gray-500 font-medium">Write • Share • Inspire</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {currentUser?.id ? (
                                <>
                                    {/* User Profile */}
                                    <Link 
                                        to={`/profile/${currentUser.id}`}
                                        className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-gray-50 ${
                                            isActiveLink(`/profile/${currentUser.id}`) 
                                                ? 'bg-blue-50 text-blue-700' 
                                                : 'text-gray-700 hover:text-gray-900'
                                        }`}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                                            {currentUser.avatar ? (
                                                <img 
                                                    src={currentUser.avatar} 
                                                    alt={currentUser.name}
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <FaUser className="text-gray-600 text-sm" />
                                            )}
                                        </div>
                                        <span className="font-medium truncate max-w-20">{currentUser?.name}</span>
                                    </Link>

                                    {/* Create Post */}
                                    <Link 
                                        to="/create"
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                            isActiveLink('/create') 
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                                                : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/25'
                                        }`}
                                    >
                                        <FaEdit className="text-sm" />
                                        <span className="font-medium">Create Post</span>
                                    </Link>

                                    {/* Authors */}
                                    <Link 
                                        to="/authors"
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                            isActiveLink('/authors') 
                                                ? 'bg-gray-100 text-gray-900' 
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FaUsers className="text-sm" />
                                        <span className="font-medium">Authors</span>
                                    </Link>

                                    {/* Logout */}
                                    <Link 
                                        to="/logout"
                                        className="flex items-center space-x-2 px-4 py-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                                    >
                                        <FaSignOutAlt className="text-sm" />
                                        <span className="font-medium">Logout</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {/* Authors */}
                                    <Link 
                                        to="/authors"
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                            isActiveLink('/authors') 
                                                ? 'bg-gray-100 text-gray-900' 
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FaUsers className="text-sm" />
                                        <span className="font-medium">Authors</span>
                                    </Link>

                                    {/* Login */}
                                    <Link 
                                        to="/login"
                                        className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <FaSignInAlt className="text-sm" />
                                        <span>Login</span>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            onClick={() => setIsNavShowing(!isNavShowing)}
                            aria-label="Toggle navigation"
                        >
                            {isNavShowing ? (
                                <AiOutlineClose className="w-6 h-6" />
                            ) : (
                                <FaBars className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`lg:hidden absolute top-full left-0 right-0 transform transition-all duration-300 ease-in-out ${
                    isNavShowing 
                        ? 'translate-y-0 opacity-100 visible' 
                        : '-translate-y-2 opacity-0 invisible'
                }`}>
                    <div className="bg-white/95 backdrop-blur-md border-t border-gray-200/60 shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 py-4">
                            {currentUser?.id ? (
                                <div className="space-y-2">
                                    {/* Mobile User Profile */}
                                    <Link 
                                        to={`/profile/${currentUser.id}`}
                                        onClick={closeNavHandler}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                            isActiveLink(`/profile/${currentUser.id}`) 
                                                ? 'bg-blue-50 text-blue-700' 
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                                            {currentUser.avatar ? (
                                                <img 
                                                    src={currentUser.avatar} 
                                                    alt={currentUser.name}
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <FaUser className="text-gray-600" />
                                            )}
                                        </div>
                                        <span className="font-medium">{currentUser?.name}</span>
                                    </Link>

                                    {/* Mobile Create Post */}
                                    <Link 
                                        to="/create"
                                        onClick={closeNavHandler}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                            isActiveLink('/create') 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
                                        }`}
                                    >
                                        <FaEdit className="text-lg" />
                                        <span className="font-medium">Create Post</span>
                                    </Link>

                                    {/* Mobile Authors */}
                                    <Link 
                                        to="/authors"
                                        onClick={closeNavHandler}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                            isActiveLink('/authors') 
                                                ? 'bg-gray-100 text-gray-900' 
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FaUsers className="text-lg" />
                                        <span className="font-medium">Authors</span>
                                    </Link>

                                    {/* Mobile Logout */}
                                    <Link 
                                        to="/logout"
                                        onClick={closeNavHandler}
                                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                                    >
                                        <FaSignOutAlt className="text-lg" />
                                        <span className="font-medium">Logout</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {/* Mobile Authors */}
                                    <Link 
                                        to="/authors"
                                        onClick={closeNavHandler}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                            isActiveLink('/authors') 
                                                ? 'bg-gray-100 text-gray-900' 
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FaUsers className="text-lg" />
                                        <span className="font-medium">Authors</span>
                                    </Link>

                                    {/* Mobile Login */}
                                    <Link 
                                        to="/login"
                                        onClick={closeNavHandler}
                                        className="flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                                    >
                                        <FaSignInAlt className="text-lg" />
                                        <span>Login</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Overlay */}
            {isNavShowing && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsNavShowing(false)}
                />
            )}
        </>
    )
}

export default Header
