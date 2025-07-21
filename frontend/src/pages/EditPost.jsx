import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/userContext'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import { 
  FaEdit, 
  FaSpinner, 
  FaCheckCircle, 
  FaArrowLeft, 
  FaImage,
  FaExclamationTriangle,
  FaCloudUploadAlt,
  FaInfoCircle,
  FaTimes,
  FaEye,
  FaFileAlt,
  FaClock,
  FaHashtag
} from 'react-icons/fa'

const EditPost = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [currentThumbnail, setCurrentThumbnail] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPost, setIsLoadingPost] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)

  const navigate = useNavigate()
  const { id } = useParams()
  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token

  // File size limits for Cloudinary
  const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

  // Helper function to handle image URLs (backward compatibility)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    
    // If it's already a full URL (Cloudinary), use it directly
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    
    // Fallback for old local images
    return `${process.env.REACT_APP_ASSETS_URL}/uploads/${imagePath}`
  }

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate('/login')
  }, [token, navigate])

  // Calculate word count
  useEffect(() => {
    const text = description.replace(/<[^>]+>/g, '').trim()
    const words = text ? text.split(/\s+/).length : 0
    setWordCount(words)
  }, [description])

  // Fetch existing post
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoadingPost(true)
      setError('')
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
          { timeout: 10000 }
        )
        
        setTitle(data.title)
        setCategory(data.category)
        setDescription(data.description)
        
        // Handle both Cloudinary URLs and local paths
        const thumbnailUrl = getImageUrl(data.thumbnail)
        setCurrentThumbnail(thumbnailUrl)
        setThumbnailPreview(thumbnailUrl)
        
      } catch (error) {
        console.error('Error fetching post:', error)
        if (error.response?.status === 404) {
          setError('Post not found.')
        } else if (error.code === 'ECONNABORTED') {
          setError('Request timeout. Please check your connection.')
        } else {
          setError('Failed to load post. Please try again.')
        }
      } finally {
        setIsLoadingPost(false)
      }
    }
    
    if (id) {
      fetchPost()
    }
  }, [id])

  // Handle file selection and preview
  useEffect(() => {
    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail)
      setThumbnailPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [thumbnail])

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['code-block'],
      ['clean'],
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'code-block'
  ]

  const POST_CATEGORIES = [
    "Agriculture", "Business", "Education", "Entertainment",
    "Art", "Investment", "Technology", "Travel", "Health",
    "Food", "Sports", "Fashion", "Science", "Music",
    "Uncategorized", "Weather"
  ]

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
      'Music': '🎵',
      'Weather': '🌤️',
      'Uncategorized': '📄'
    }
    return icons[category] || '📄'
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setError('')

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)')
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image file is too large. Please choose a file smaller than 2MB.')
      return
    }

    setThumbnail(file)
  }

  const removeThumbnail = () => {
    setThumbnail(null)
    setThumbnailPreview(currentThumbnail)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setUploadProgress(0)

    // Validation
    if (!title.trim()) {
      setError('Please enter a title')
      return
    }

    if (!description.trim() || description.trim() === '<p><br></p>') {
      setError('Please enter post content')
      return
    }

    setIsLoading(true)
    
    const formData = new FormData()
    formData.set('title', title)
    formData.set('category', category)
    formData.set('description', description)
    if (thumbnail) formData.set('thumbnail', thumbnail)

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
          timeout: 60000, // 60 seconds for Cloudinary upload
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            setUploadProgress(percentCompleted)
          }
        }
      )
      
      if (response.status === 200) {
        navigate(`/posts/${id}`)
      }
    } catch (err) {
      console.error('Update error:', err)
      
      if (err.code === 'ECONNABORTED') {
        setError('Upload timeout. Please try again with a smaller image.')
      } else if (err.response?.status === 413) {
        setError('Image file is too large. Please choose a smaller image.')
      } else if (err.response?.status === 403) {
        setError('You do not have permission to edit this post.')
      } else if (err.response?.status === 404) {
        setError('Post not found.')
      } else {
        setError(err.response?.data?.message || 'Update failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  const getReadingTime = () => {
    return Math.max(1, Math.ceil(wordCount / 200))
  }

  if (isLoadingPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
          <p className="text-gray-600">Loading post...</p>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Navigation */}
          <div className="mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back</span>
            </button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaEdit className="text-white text-xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
                    <p className="text-gray-600">Update your article content and settings</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    showPreview 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <FaEye />
                  <span>{showPreview ? 'Edit Mode' : 'Preview'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <FaFileAlt className="text-white text-sm" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{wordCount}</div>
                <div className="text-sm text-gray-600 font-medium">Words</div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <FaClock className="text-white text-sm" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{getReadingTime()}</div>
                <div className="text-sm text-gray-600 font-medium">Min Read</div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <FaHashtag className="text-white text-sm" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{title.length}</div>
                <div className="text-sm text-gray-600 font-medium">Title Length</div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <FaExclamationTriangle className="text-red-500 text-lg mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isLoading && uploadProgress > 0 && (
            <div className="mb-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <FaCloudUploadAlt className="text-green-600" />
                  <span className="text-green-800 font-medium">Updating your post...</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-green-700 text-sm mt-1">{uploadProgress}% complete</p>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {!showPreview ? (
              /* Edit Mode */
              <form className="p-8 space-y-8" onSubmit={submit}>
                
                {/* Title Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Post Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-4 py-4 text-lg border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter an engaging title..."
                    maxLength={100}
                    autoFocus
                  />
                  <div className="text-sm text-gray-500">
                    {100 - title.length} characters remaining
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Category</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl z-10">
                      {getCategoryIcon(category)}
                    </div>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full pl-16 pr-4 py-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 appearance-none"
                    >
                      {POST_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Featured Image</label>
                  
                  {/* Current/Preview Image */}
                  {thumbnailPreview && (
                    <div className="relative rounded-xl overflow-hidden mb-4">
                      <img 
                        src={thumbnailPreview} 
                        alt="Post thumbnail" 
                        className="w-full h-64 object-cover"
                      />
                      {thumbnail && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={removeThumbnail}
                            className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* File Input */}
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl cursor-pointer transition-colors duration-200">
                      <FaImage className="text-gray-500" />
                      <span className="text-gray-700 font-medium">
                        {thumbnail ? 'Change Image' : 'Choose New Image'}
                      </span>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp"
                        onChange={handleFile}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="text-sm text-gray-500">
                    <FaInfoCircle className="inline mr-1" />
                    Leave empty to keep current image. Supports: PNG, JPG, JPEG, WEBP (Max 2MB)
                  </div>
                </div>

                {/* Content Editor */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Content</label>
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <ReactQuill
                      modules={modules}
                      formats={formats}
                      value={description}
                      onChange={setDescription}
                      placeholder="Update your content..."
                      className="min-h-[400px]"
                      style={{ 
                        backgroundColor: 'white',
                        borderRadius: '0.75rem'
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>
                          {uploadProgress > 0 ? `Updating... ${uploadProgress}%` : 'Updating Post...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        <span>Update Post</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Preview Mode */
              <div className="p-8">
                <div className="max-w-4xl mx-auto">
                  {/* Preview Header */}
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      {title || 'Untitled Post'}
                    </h1>
                    <div className="flex items-center space-x-6 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getCategoryIcon(category)}</span>
                        <span className="font-medium">{category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaClock />
                        <span>{getReadingTime()} min read</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaFileAlt />
                        <span>{wordCount} words</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview Thumbnail */}
                  {thumbnailPreview && (
                    <div className="mb-8">
                      <img 
                        src={thumbnailPreview} 
                        alt="Post thumbnail" 
                        className="w-full h-80 object-cover rounded-xl shadow-lg"
                      />
                    </div>
                  )}
                  
                  {/* Preview Content */}
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: description }}
                    style={{
                      fontSize: '1.125rem',
                      lineHeight: '1.7',
                      color: '#374151'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPost
