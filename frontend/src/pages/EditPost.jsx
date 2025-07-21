import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/userContext'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import { FaEdit, FaSpinner, FaCheckCircle } from 'react-icons/fa'

const EditPost = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { id } = useParams()
  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token

  // redirect if not logged in
  useEffect(() => {
    if (!token) navigate('/login')
  }, [token])

  // fetch existing post
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
      .then(({ data }) => {
        setTitle(data.title)
        setCategory(data.category)
        setDescription(data.description)
      })
      .catch(console.error)
  }, [id])

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  }
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
  ]

  const POST_CATEGORIES = [
    "Agriculture","Business","Education","Entertainment",
    "Art","Investment","Technology","Travel","Health",
    "Food","Sports","Fashion","Science","Music",
    "Uncategorized","Weather"
  ]

  const handleFile = e => setThumbnail(e.target.files[0])

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !description.trim()) {
      setError('Title and content cannot be empty.')
      return
    }
    setIsLoading(true)
    const form = new FormData()
    form.set('title', title)
    form.set('category', category)
    form.set('description', description)
    if (thumbnail) form.set('thumbnail', thumbnail)
    try {
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        form,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 bg-white/80 backdrop-blur-xl rounded-2xl p-6 flex items-center justify-between shadow-lg border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl flex items-center justify-center">
              <FaEdit className="text-white text-xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Edit Post
            </h1>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8S14.42 2 10 2zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={submit}>
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                placeholder="Post title…"
                maxLength={100}
                autoFocus
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              >
                {POST_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content
              </label>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <ReactQuill
                  modules={modules}
                  formats={formats}
                  value={description}
                  onChange={setDescription}
                  placeholder="Write your post content…"
                  className="min-h-[300px]"
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Featured Image
              </label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleFile}
                className="block w-full text-gray-500 file:py-2 file:px-4 file:bg-green-50 file:border-0 file:rounded-full file:text-green-600 hover:file:bg-green-100 transition"
              />
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl transition-transform transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Updating…</span>
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
        </div>
      </div>
    </div>
  )
}

export default EditPost
