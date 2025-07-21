const Post = require('../models/postModel')
const User = require('../models/userModel')
const cloudinary = require('cloudinary').v2
const { v4: uuid } = require('uuid')
const HttpError = require('../models/errorModel')

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// =========================Creating a post==========================
// Post: api/posts
//Protected

const createPost = async(req, res, next) => {
    try {
        let {title, category, description} = req.body;
        
        // Validate required fields
        if(!title || !category || !description) {
            return next(new HttpError("Fill in all fields and choose thumbnail.", 422))
        }

        // Check if files exist
        if(!req.files || !req.files.thumbnail) {
            return next(new HttpError("Please upload a thumbnail image.", 422))
        }

        const {thumbnail} = req.files;

        // Validate file
        if(!thumbnail.tempFilePath) {
            return next(new HttpError("Invalid file upload. Please try again.", 422))
        }

        // Check the file size
        if(thumbnail.size > 2000000){
            return next(new HttpError("Thumbnail too big. File should be less than 2mb.", 422))
        }

        // Upload to Cloudinary
        try {
            const uploadResult = await cloudinary.uploader.upload(thumbnail.tempFilePath, {
                folder: 'blog-posts',
                public_id: `post_${uuid()}`,
                resource_type: 'auto',
                quality: 'auto',
                fetch_format: 'auto'
            })

            const newPost = await Post.create({
                title, 
                category, 
                description, 
                thumbnail: uploadResult.secure_url, // Store Cloudinary URL
                creator: req.user.id
            })

            if(!newPost){
                return next(new HttpError("Post couldn't be created.", 422))
            }

            // Find user and increase the post count by 1
            const currentUser = await User.findById(req.user.id)
            if(currentUser) {
                const userPostCount = currentUser.posts + 1
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})
            }

            res.status(201).json(newPost)
            
        } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError)
            return next(new HttpError("Failed to upload image. Please try again.", 500))
        }
    } 
    catch (error) {
        console.error('Create post error:', error)
        return next(new HttpError("Post creation failed. Please try again.", 500))   
    }
}

// =========================Get all posts==========================
// Get: api/posts
//Unprotected

const getPosts = async(req, res, next) => {
    try {
        const posts = await Post.find().sort({updatedAt: -1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// =========================Get single post==========================
// Get: api/posts/:id
//Unprotected

const getPost = async(req, res, next) => {
    try {
       const postId = req.params.id;
       const post = await Post.findById(postId)
       if(!post){
        return next(new HttpError("Post not found.", 404))
       } 
       res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// =========================Get posts by category==========================
// Get: api/posts/categories/:category
//Unprotected

const getCatPosts = async(req, res, next) => {
    try {
        const {category} = req.params
        const catPosts = await Post.find({category}).sort({createdAt: -1})
        res.status(200).json(catPosts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// =========================Get user/author post==========================
// Get: api/posts/users/:id
//Unprotected

const getUserPosts = async(req, res, next) => {
    try {
        const {id} = req.params
        const posts = await Post.find({creator: id}).sort({createdAt: -1})
        res.status(200).json(posts)   
    } 
    catch (error) {
        return next(new HttpError(error))
    }
}

// =========================Edit post==========================
// Patch: api/posts/:id
//Protected

const editPost = async(req, res, next) => {
    try {
        let updatedPost;
        const postId = req.params.id
        let {title, category, description} = req.body;
        
        // ReactQuill has a paragraph opening and closing tag with a break tag in between so there are 11 characters in there already.
        if(!title || !category || description.length < 12){
            return next(new HttpError("Fill in all fields.", 422))
        }

        // Get old post from the database
        const oldPost = await Post.findById(postId)
        if(!oldPost){
            return next(new HttpError("Post not found.", 404))
        }

        // Check if user is the creator
        if(req.user.id !== oldPost.creator.toString()){
            return next(new HttpError("Unauthorized to edit this post.", 403))
        }

        if(!req.files || !req.files.thumbnail){
            // No new image uploaded - just update text fields
            updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description}, {new: true})
        } else {
            // New image uploaded
            const {thumbnail} = req.files

            // Check the size of the file
            if(thumbnail.size > 2000000){
                return next(new HttpError("Thumbnail too big. Should be less than 2mb", 422))
            }

            // Validate temp file path
            if(!thumbnail.tempFilePath) {
                return next(new HttpError("Invalid file upload. Please try again.", 422))
            }

            try {
                // Delete old image from Cloudinary if it exists and is a Cloudinary URL
                if(oldPost.thumbnail && oldPost.thumbnail.includes('cloudinary.com')){
                    const urlParts = oldPost.thumbnail.split('/')
                    const publicIdWithExt = urlParts[urlParts.length - 1]
                    const publicId = publicIdWithExt.split('.')[0]
                    const folderPath = `blog-posts/${publicId}`
                    
                    try {
                        await cloudinary.uploader.destroy(folderPath)
                    } catch (deleteError) {
                        console.log('Could not delete old image from Cloudinary:', deleteError.message)
                        // Continue with upload even if deletion fails
                    }
                }

                // Upload new image to Cloudinary
                const uploadResult = await cloudinary.uploader.upload(thumbnail.tempFilePath, {
                    folder: 'blog-posts',
                    public_id: `post_${uuid()}`,
                    resource_type: 'auto',
                    quality: 'auto',
                    fetch_format: 'auto'
                })

                updatedPost = await Post.findByIdAndUpdate(postId, {
                    title, 
                    category, 
                    description, 
                    thumbnail: uploadResult.secure_url
                }, {new: true})
                
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError)
                return next(new HttpError("Failed to upload new image. Please try again.", 500))
            }
        }

        if(!updatedPost){
            return next(new HttpError("Couldn't update post.", 400))
        }
        res.status(200).json(updatedPost)
    } 
    catch (error) {
        console.error('Edit post error:', error)
        return next(new HttpError("Failed to update post. Please try again.", 500))
    }
}

// =========================Delete Post==========================
// Delete: api/posts/:id
//Protected

const deletePost = async(req, res, next) => {
    try {
        const postId = req.params.id
        if(!postId){
            return next(new HttpError("Post Unavailable.", 400))
        }   

        const post = await Post.findById(postId)
        if(!post){
            return next(new HttpError("Post not found.", 404))
        }

        // Check if user is the creator
        if(req.user.id !== post.creator.toString()){
            return next(new HttpError("Unauthorized to delete this post.", 403))
        }

        try {
            // Delete image from Cloudinary if it's a Cloudinary URL
            if(post.thumbnail && post.thumbnail.includes('cloudinary.com')){
                const urlParts = post.thumbnail.split('/')
                const publicIdWithExt = urlParts[urlParts.length - 1]
                const publicId = publicIdWithExt.split('.')[0]
                const folderPath = `blog-posts/${publicId}`
                
                try {
                    await cloudinary.uploader.destroy(folderPath)
                } catch (deleteError) {
                    console.log('Could not delete image from Cloudinary:', deleteError.message)
                    // Continue with post deletion even if Cloudinary deletion fails
                }
            }

            // Delete post from database
            await Post.findByIdAndDelete(postId)

            // Find user and reduce post count by 1
            const currentUser = await User.findById(req.user.id)
            if(currentUser) {
                const userPostCount = Math.max(0, currentUser.posts - 1)
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})
            }

            res.status(200).json({
                message: `Post ${postId} deleted successfully.`,
                success: true
            })
            
        } catch (deleteError) {
            console.error('Delete operation error:', deleteError)
            return next(new HttpError("Failed to delete post. Please try again.", 500))
        }
    } 
    catch (error) {
        console.error('Delete post error:', error)
        return next(new HttpError("Failed to delete post. Please try again.", 500))
    }
}

module.exports = {
    createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost
}
