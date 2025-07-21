const {Schema, model} = require("mongoose")

const postSchema = new Schema({
    title : {type: String, required: true},
    category : {
        type: String, 
        enum: [
            "Agriculture", 
            "Business", 
            "Education", 
            "Entertainment", 
            "Art", 
            "Investment", 
            "Technology",     // Added missing categories
            "Travel", 
            "Health", 
            "Food", 
            "Sports", 
            "Fashion", 
            "Science", 
            "Music", 
            "Uncategorized", 
            "Weather"
        ], 
        default: "Uncategorized",
        message: "{VALUE} is not a supported category"
    },
    description : {type: String, required: true},
    creator : {type: Schema.Types.ObjectId, ref: "User", required: true},
    thumbnail : {type: String, required: true},
    views: {type: Number, default: 0},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    tags: [String]
}, {timestamps: true})

// Add indexes for better performance
postSchema.index({ category: 1 })
postSchema.index({ creator: 1 })
postSchema.index({ createdAt: -1 })
postSchema.index({ title: 'text', description: 'text' })

module.exports = model("Post", postSchema)
