import React, { useState, useContext, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  FaImage, 
  FaEye, 
  FaEdit, 
  FaTimes, 
  FaCloudUploadAlt,
  FaSpinner,
  FaCheckCircle,
  FaFeather,
  FaFileAlt,
  FaClock,
  FaHashtag
} from 'react-icons/fa'

const CreatePost = () => {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Uncategorized")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [thumbnailPreview, setThumbnailPreview] = useState("")
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  
  const navigate = useNavigate()
  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [navigate, token])

  // Calculate word count
  useEffect(() => {
    const text = description.replace(/<[^>]+>/g, '').trim()
    const words = text ? text.split(/\s+/).length : 0
    setWordCount(words)
  }, [description])

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['code-block'],
      ['clean']
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

  const getCategoryColor = (category) => {
    const colors = {
      'Agriculture': 'from-green-500 to-emerald-600',
      'Business': 'from-blue-500 to-blue-600',
      'Education': 'from-indigo-500 to-indigo-600',
      'Entertainment': 'from-purple-500 to-purple-600',
      'Art': 'from-pink-500 to-pink-600',
      'Investment': 'from-yellow-500 to-yellow-600',
      'Technology': 'from-gray-500 to-gray-600',
      'Travel': 'from-cyan-500 to-cyan-600',
      'Health': 'from-red-500 to-red-600',
      'Food': 'from-orange-500 to-orange-600',
      'Sports': 'from-teal-500 to-teal-600',
      'Fashion': 'from-rose-500 to-rose-600',
      'Science': 'from-violet-500 to-violet-600',
      'Music': 'from-emerald-500 to-emerald-600',
      'Weather': 'from-sky-500 to-sky-600',
      'Uncategorized': 'from-gray-500 to-gray-600'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  const handleThumbnailChange = (file) => {
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleThumbnailChange(files[0])
    }
  }

  const removeThumbnail = () => {
    setThumbnail("")
    setThumbnailPreview("")
  }

  const createPost = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!title.trim()) {
      setError('Please enter a title')
      setIsLoading(false)
      return
    }

    if (!description.trim()) {
      setError('Please enter post content')
      setIsLoading(false)
      return
    }

    if (!thumbnail) {
      setError('Please upload a thumbnail image')
      setIsLoading(false)
      return
    }

    const postData = new FormData()
    postData.set('title', title)
    postData.set('category', category)
    postData.set('description', description)
    postData.set('thumbnail', thumbnail)

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/posts`, 
        postData, 
        {
          withCredentials: true, 
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.status === 201) {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setIsLoading(false)
    }
  }

  const getReadingTime = () => {
    return Math.max(1, Math.ceil(wordCount / 200))
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
          
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaFeather className="text-white text-xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
                    <p className="text-gray-600">Share your thoughts and stories with the world</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    showPreview 
                      ? 'bg-blue-600 text-white shadow-lg' 
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

          {/* Error Message */}
          {error && (
            <div className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            {!showPreview ? (
              /* Edit Mode */
              <form className="p-8 space-y-8" onSubmit={createPost}>
                
                {/* Title Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">Post Title</label>
                  <input
                    type="text"
                    placeholder="Enter an engaging title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-4 text-lg border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    autoFocus
                    maxLength={100}
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
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-16 pr-4 py-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 appearance-none"
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
                  {!thumbnailPreview ? (
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 ${
                        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50/50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your image here</h3>
                      <p className="text-gray-600 mb-4">or click to browse</p>
                      <input
                        type="file"
                        onChange={(e) => handleThumbnailChange(e.target.files[0])}
                        accept=".png,.jpg,.jpeg,.webp"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-sm text-gray-500">
                        Supports: PNG, JPG, JPEG, WEBP (Max 2MB)
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={removeThumbnail}
                          className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
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
                      placeholder="Start writing your amazing content..."
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
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Creating Post...</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        <span>Publish Post</span>
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
                      <div className={`flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${getCategoryColor(category)} text-white rounded-full text-sm font-semibold`}>
                        <span>{getCategoryIcon(category)}</span>
                        <span>{category}</span>
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

export default CreatePost
