import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { FaFeather } from 'react-icons/fa'

const Layout = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [loadingProgress, setLoadingProgress] = useState(0)

    useEffect(() => {
        // Simulate loading progress
        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                return prev + Math.random() * 15
            })
        }, 100)

        // Complete loading after progress reaches 100%
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1200)

        return () => {
            clearTimeout(timer)
            clearInterval(progressInterval)
        }
    }, [])

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center z-50">
                {/* Background Animation */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/15 to-pink-300/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-200/10 to-blue-300/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Loader Container */}
                <div className="relative z-10 text-center">
                    {/* Logo with Animation */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
                                <FaFeather className="text-white text-3xl" />
                            </div>
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-full blur animate-ping"></div>
                        </div>
                    </div>

                    {/* Brand Name */}
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        WeBlog
                    </h3>

                    {/* Loading Text */}
                    <p className="text-gray-600 text-lg mb-8 animate-pulse">
                        Preparing your writing experience...
                    </p>

                    {/* Progress Bar */}
                    <div className="w-80 max-w-sm mx-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">Loading</span>
                            <span className="text-sm font-semibold text-blue-600">{Math.round(loadingProgress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                                className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Loading Dots */}
                    <div className="flex justify-center items-center space-x-2 mt-6">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header */}
            <Header />
            
            {/* Main Content */}
            <main className="flex-1 relative">
                {/* Content with fade-in animation */}
                <div className="animate-fadeIn">
                    <Outlet />
                </div>
            </main>
            
            {/* Footer */}
            <Footer />
        </div>
    )
}

// Add custom animations
const addCustomStyles = () => {
    if (!document.querySelector('#layout-animations')) {
        const style = document.createElement('style')
        style.id = 'layout-animations'
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .animate-fadeIn {
                animation: fadeIn 0.6s ease-out forwards;
            }
            
            @keyframes slideDown {
                from {
                    transform: translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .animate-slideDown {
                animation: slideDown 0.4s ease-out forwards;
            }
        `
        document.head.appendChild(style)
    }
}

// Initialize custom styles
addCustomStyles()

export default Layout
