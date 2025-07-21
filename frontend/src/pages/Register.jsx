import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaFeather, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserPlus, FaSpinner } from 'react-icons/fa'

const Register = () => {
  const [userData, setUserData] = useState({
    name: '', 
    email: '', 
    password: '', 
    password2: ''
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const navigate = useNavigate()

  const changeInputHandler = (e) => {
    setUserData(prevState => {
      const newState = { ...prevState, [e.target.name]: e.target.value }
      
      // Calculate password strength
      if (e.target.name === 'password') {
        setPasswordStrength(calculatePasswordStrength(e.target.value))
      }
      
      return newState
    })
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'bg-red-500'
      case 2: return 'bg-orange-500'
      case 3: return 'bg-yellow-500'
      case 4: return 'bg-blue-500'
      case 5: return 'bg-green-500'
      default: return 'bg-gray-200'
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'Weak'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Strong'
      case 5: return 'Very Strong'
      default: return ''
    }
  }

  const registerUser = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData)
      const newUser = await response.data
      console.log(newUser)
      if (!newUser) {
        setError("Couldn't register user. Please try again.")
      }
      navigate('/login')
    } catch (err) {
      setError(err.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-purple-300/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 left-8 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-cyan-300/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-8 right-1/4 w-20 h-20 bg-gradient-to-br from-pink-200/25 to-rose-300/25 rounded-full blur-xl"></div>
      </div>

      {/* Register Container */}
      <div className="w-full max-w-lg relative z-10">
        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaFeather className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                WeBlog
              </h1>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Join our community of writers and start sharing your stories
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={registerUser}>
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
            
            {/* Full Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  name="name" 
                  value={userData.name} 
                  onChange={changeInputHandler} 
                  placeholder="Enter your full name"
                  autoFocus
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                           text-gray-900 placeholder-gray-500 hover:border-gray-300"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  value={userData.email} 
                  onChange={changeInputHandler} 
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                           text-gray-900 placeholder-gray-500 hover:border-gray-300"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password" 
                  value={userData.password} 
                  onChange={changeInputHandler}
                  placeholder="Create a strong password"
                  required
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                           text-gray-900 placeholder-gray-500 hover:border-gray-300"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {userData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength <= 2 ? 'text-red-600' : 
                      passwordStrength === 3 ? 'text-yellow-600' : 
                      passwordStrength === 4 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  name="password2" 
                  value={userData.password2} 
                  onChange={changeInputHandler}
                  placeholder="Confirm your password"
                  required
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                           text-gray-900 placeholder-gray-500 hover:border-gray-300"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {userData.password2 && (
                <div className="flex items-center space-x-2 mt-2">
                  {userData.password === userData.password2 ? (
                    <>
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-green-600 font-medium">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-red-600 font-medium">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input type="checkbox" required className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-gray-600 leading-relaxed">
                I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</Link>
              </span>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading || userData.password !== userData.password2}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                       text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 
                       shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FaUserPlus />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <span className="text-gray-600 text-sm">Already have an account? </span>
            <Link 
              to="/login" 
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
