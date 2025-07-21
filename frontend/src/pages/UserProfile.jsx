import React, {
  useState,
  useEffect,
  useContext
} from 'react'
import {
  Link,
  useNavigate
} from 'react-router-dom'
import {
  FaEdit,
  FaCheck,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaSpinner,
  FaFileAlt,
  FaCog,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCompress
} from 'react-icons/fa'
import axios from 'axios'
import Loader from '../components/Loader'
import { UserContext } from '../context/userContext'

const UserProfile = () => {
  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isAvatarTouched, setIsAvatarTouched] = useState(false)
  const [isAvatarUpdating, setIsAvatarUpdating] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const [isImageProcessing, setIsImageProcessing] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [originalEmail, setOriginalEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [error, setError] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // More aggressive file size limits
  const MAX_FILE_SIZE = 1.5 * 1024 * 1024 // 1.5MB
  const TARGET_SIZE = 1 * 1024 * 1024 // Target 1MB

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate('/login')
  }, [token, navigate])

  // Fetch user data
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true)
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setName(data.name)
        setEmail(data.email)
        setOriginalEmail(data.email) // Store original email
        setAvatarUrl(
          `${process.env.REACT_APP_ASSETS_URL}/uploads/${data.avatar}`
        )
        setPreviewUrl(
          `${process.env.REACT_APP_ASSETS_URL}/uploads/${data.avatar}`
        )
      } catch (err) {
        console.error(err)
      }
      setIsLoading(false)
    }
    loadUser()
  }, [currentUser.id, token])

  // Preview new avatar
  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile)
      setPreviewUrl(url)
      setIsAvatarTouched(true)
    }
  }, [avatarFile])

  // Aggressive image compression function
  const compressImage = (file, maxWidth = 600, maxHeight = 600, targetSize = TARGET_SIZE) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate dimensions to maintain aspect ratio
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw image
        ctx.drawImage(img, 0, 0, width, height)
        
        // Start with lower quality and adjust
        let quality = 0.4
        
        const tryCompress = (q) => {
          canvas.toBlob((blob) => {
            if (blob.size <= targetSize || q <= 0.1) {
              resolve(blob)
            } else {
              tryCompress(q - 0.1)
            }
          }, 'image/jpeg', q)
        }
        
        tryCompress(quality)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const handleAvatarSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setAvatarError('')
    setIsImageProcessing(true)

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setAvatarError('Please select a valid image file (JPEG, PNG, or WebP)')
      setIsImageProcessing(false)
      return
    }

    try {
      let processedFile = file

      // Always compress if file is larger than target or if it's over the limit
      if (file.size > TARGET_SIZE) {
        console.log('Compressing image from', file.size, 'bytes')
        processedFile = await compressImage(file, 600, 600, TARGET_SIZE)
        console.log('Compressed to', processedFile.size, 'bytes')
      }

      // Final size check - if still too large, try more aggressive compression
      if (processedFile.size > MAX_FILE_SIZE) {
        console.log('Still too large, applying aggressive compression...')
        processedFile = await compressImage(file, 400, 400, TARGET_SIZE * 0.5)
      }

      // Last resort check
      if (processedFile.size > MAX_FILE_SIZE) {
        setAvatarError('Unable to compress image enough. Please choose a smaller image.')
        setIsImageProcessing(false)
        return
      }

      setAvatarFile(processedFile)
    } catch (error) {
      console.error('Image processing error:', error)
      setAvatarError('Error processing image. Please try a different file.')
    }
    
    setIsImageProcessing(false)
  }

  const changeAvatarHandler = async () => {
    if (!avatarFile) return
    setIsAvatarUpdating(true)
    setAvatarError('')
    
    try {
      const formData = new FormData()
      formData.append('avatar', avatarFile)
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/change-avatar`,
        formData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const newUrl = `${process.env.REACT_APP_ASSETS_URL}/uploads/${data.avatar}`
      setAvatarUrl(newUrl)
      setPreviewUrl(newUrl)
      setAvatarFile(null)
      setIsAvatarTouched(false)
    } catch (err) {
      console.error(err)
      setAvatarError('Failed to update avatar. Please try again.')
    }
    setIsAvatarUpdating(false)
  }

  const updateUserDetails = async e => {
    e.preventDefault()
    setError('')
    setIsUpdating(true)
    try {
      const form = new FormData()
      form.append('name', name)
      form.append('email', email)
      form.append('currentPassword', currentPassword)
      form.append('newPassword', newPassword)
      form.append('confirmNewPassword', confirmNewPassword)

      const res = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/users/edit-user`,
        form,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (res.status === 200) {
        navigate('/logout')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
    setIsUpdating(false)
  }

  const emailChanged = email !== originalEmail

  if (isLoading) return <Loader />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24 pb-16">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-indigo-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/10 to-pink-300/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FaCog className="text-blue-600 text-xl" />
            <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">Settings</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Profile Settings
            </span>
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                <p className="text-blue-100">Manage your profile and security settings</p>
              </div>
              <Link
                to={`/myposts/${currentUser.id}`}
                className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 border border-white/20"
              >
                <FaFileAlt />
                <span>My Posts</span>
              </Link>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Side - Avatar & Info */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 text-center">
                  
                  {/* Avatar Section */}
                  <div className="relative inline-block mb-6">
                    <div className="relative">
                      <img
                        src={previewUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=200`}
                        alt={name}
                        className="w-32 h-32 rounded-3xl object-cover shadow-xl ring-4 ring-white mx-auto"
                      />
                      
                      {/* Avatar Edit Overlay */}
                      <div className="absolute inset-0 bg-black/50 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <label
                          htmlFor="avatarInput"
                          className="cursor-pointer text-white hover:text-blue-300 transition-colors"
                          title="Change avatar"
                        >
                          {isImageProcessing ? (
                            <FaSpinner className="text-2xl animate-spin" />
                          ) : (
                            <FaCamera className="text-2xl" />
                          )}
                        </label>
                        <input
                          type="file"
                          id="avatarInput"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          className="hidden"
                          onChange={handleAvatarSelect}
                          disabled={isImageProcessing}
                        />
                      </div>

                      {/* Save Avatar Button */}
                      {isAvatarTouched && !isAvatarUpdating && !isImageProcessing && (
                        <button
                          onClick={changeAvatarHandler}
                          className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
                          title="Save avatar"
                        >
                          <FaCheck />
                        </button>
                      )}

                      {/* Loading Indicator */}
                      {(isAvatarUpdating || isImageProcessing) && (
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center">
                          <FaSpinner className="animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Avatar Error */}
                  {avatarError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <FaExclamationTriangle className="text-red-500 text-sm" />
                        <p className="text-red-700 text-sm font-medium">{avatarError}</p>
                      </div>
                    </div>
                  )}

                  {/* Image Processing Info */}
                  {isImageProcessing && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <FaCompress className="text-blue-500 text-sm animate-pulse" />
                        <p className="text-blue-700 text-sm font-medium">Compressing image...</p>
                      </div>
                    </div>
                  )}

                  {/* File Size Info */}
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <FaInfoCircle className="text-blue-500 text-sm" />
                      <p className="text-blue-700 text-xs">
                        Images are automatically compressed. Max size: 1.5MB
                      </p>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
                    <p className="text-gray-600">{email}</p>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Edit Form */}
              <div className="lg:col-span-2">
                <form className="space-y-6" onSubmit={updateUserDetails}>
                  
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

                  {/* Email Change Warning */}
                  {emailChanged && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <FaExclamationTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                      </div>
                      <div>
                        <p className="text-amber-800 text-sm font-medium">Email Change Notice</p>
                        <p className="text-amber-700 text-sm mt-1">
                          Changing your email will require you to log in again for security purposes.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Personal Information */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <FaUser className="text-blue-600" />
                      <span>Personal Information</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name Input */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                        <div className="relative">
                          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            disabled={isUpdating}
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            required
                          />
                        </div>
                      </div>

                      {/* Email Input - MADE FULLY EDITABLE */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Email Address
                          <span className="text-xs text-green-600 ml-2 font-normal">(Editable)</span>
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={isUpdating} // Only disabled during updating, not always
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password Security */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <FaLock className="text-blue-600" />
                      <span>Password Security</span>
                    </h4>
                    
                    <div className="space-y-4">
                      {/* Current Password */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Current Password</label>
                        <div className="relative">
                          <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            disabled={isUpdating}
                            className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* New Password */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">New Password</label>
                          <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              value={newPassword}
                              onChange={e => setNewPassword(e.target.value)}
                              disabled={isUpdating}
                              className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                          <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              value={confirmNewPassword}
                              onChange={e => setConfirmNewPassword(e.target.value)}
                              disabled={isUpdating}
                              className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Password Match Indicator */}
                      {newPassword && confirmNewPassword && (
                        <div className="flex items-center space-x-2 mt-2">
                          {newPassword === confirmNewPassword ? (
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
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {isUpdating ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Updating Profile...</span>
                        </>
                      ) : (
                        <>
                          <FaCheck />
                          <span>Update Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
