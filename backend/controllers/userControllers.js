const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const fileUpload = require('express-fileupload')
const {v4: uuid} = require('uuid')

const User = require('../models/userModel')
const HttpError = require('../models/errorModel')

// =========================Register a New User==========================
// Post: api/users/register
//Unprotected

const registerUser = async(req,res,next)=>{
    try{
        const {name,email,password,password2}=req.body;
        if(!name || !email || !password){
            return next(new HttpError("Fill in all fields.", 422))
        }

        const newEmail=email.toLowerCase()

        //Checking if the email is already registered
        const emailExits=await User.findOne({email:newEmail})
        if(emailExits) {
            return next (new HttpError("This Email is already Registered", 422))
        }

        if((password.trim()).length < 6){
            return next(new HttpError("Password must be at least 6 characters long", 422))
        }

        if(password!=password2){
            return next(new HttpError("Password do not match.", 422))
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password,salt)
        const newUser = await User.create({name, email: newEmail,password: hashedPass })
        res.status(201).json(`New User ${newUser.email} registered.`)
    }
    catch(error){
        return next(new HttpError("User registration failed.", 422))
    }
}

// =========================Login a registered user==========================
// Post: api/users/login
//Unprotected

const loginUser = async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return next(new HttpError("Fill in all fields.", 422))
        }

        const newEmail = email.toLowerCase()

        const user = await User.findOne({email: newEmail})

        if(!user){
            return next(new HttpError("Invalid credentials.", 422))
        }

        const comparePass = await bcrypt.compare(password,user.password)
        if(!comparePass){
            return next(new HttpError("Invalid credentials.", 422))
        }
        const {_id: id, name} = user;
        const token = jwt.sign({id, name}, process.env.JWT_SECRET, {expiresIn: "1d"})
        res.status(200).json({token, id, name})
    }
    catch(error){
        return next(new HttpError("Login failed. Please check your credentials.",422))
    }
}

// =========================User Profile==========================
// GET: api/users/:id
//Protected

const getUser = async(req,res,next)=>{
    try {
      const {id} = req.params;
      const user = await User.findById(id).select('-password')
      if(!user){
        return next(new HttpError("User not found.", 404))
      }
      res.status(200).json(user)  
    } 
    catch (error) {
        return next(new HttpError(error))
    }
}

// =========================Change user Avatar(profile picture)==========================
// POST: api/users/change-avatar
//Protected

const changeAvatar = async(req,res,next)=>{
    try {
        // Check if files exist
        if(!req.files || !req.files.avatar){
            return next(new HttpError("Please choose an image.", 422))
        }

        //find user from database
        const user = await User.findById(req.user.id)
        if(!user){
            return next(new HttpError("User not found.", 404))
        }

        //delete old avatar if exists (FIXED ERROR HANDLING)
        if(user.avatar){
            const oldAvatarPath = path.join(__dirname, '..', 'uploads', user.avatar)
            try {
                // Check if file exists before trying to delete
                if(fs.existsSync(oldAvatarPath)){
                    fs.unlinkSync(oldAvatarPath)
                }
            } catch (deleteError) {
                console.log('Could not delete old avatar:', deleteError.message)
                // Don't return error - continue with upload
            }
        }

        const {avatar} = req.files
        
        // INCREASED FILE SIZE LIMIT (was causing issues with compressed images)
        if (avatar.size > 2000000){ // 2MB limit
            return next(new HttpError("Profile picture too big. Should be less than 2MB", 422))
        }

        let fileName = avatar.name
        let splittedFilename = fileName.split('.')
        let newFileName = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length - 1]
        
        const uploadPath = path.join(__dirname, '..', 'uploads', newFileName)
        
        avatar.mv(uploadPath, async (err) => {
            if (err){
                return next(new HttpError("File upload failed.", 500))
            }

            try {
                const updatedAvatar = await User.findByIdAndUpdate(req.user.id, {avatar: newFileName}, {new: true})
                if(!updatedAvatar){
                    return next(new HttpError("Avatar couldn't be changed.", 422))
                }
                res.status(200).json(updatedAvatar)
            } catch (updateError) {
                return next(new HttpError("Database update failed.", 500))
            }
        })
    } 
    catch (error) {
        return next(new HttpError("Avatar change failed.", 500))
    }
}

// =========================Edit User Details (from profile)==========================
// PATCH: api/users/edit-user
//Protected

const editUser = async(req,res,next)=>{
    try{
        const {name, email, currentPassword, newPassword, confirmNewPassword} = req.body;
        
        // FIXED: Only require name and email as mandatory fields
        if(!name || !email){
            return next(new HttpError("Name and email are required.", 422))
        }

        //get user from database
        const user = await User.findById(req.user.id)
        if(!user){
            return next(new HttpError("User not found.", 403))
        }

        //make sure new email doesn't already exist
        const newEmail = email.toLowerCase()
        const emailExist = await User.findOne({email: newEmail})

        //we want to update their details with/without changing the email
        if(emailExist && (emailExist._id.toString() !== req.user.id)){
            return next(new HttpError("Email already exist.", 422))
        }

        // FIXED: Handle password change as OPTIONAL
        if(currentPassword || newPassword || confirmNewPassword) {
            // If any password field is provided, all are required
            if(!currentPassword || !newPassword || !confirmNewPassword){
                return next(new HttpError("All password fields are required to change password.", 422))
            }

            //compare current password to db password 
            const validateUserPassword = await bcrypt.compare(currentPassword, user.password)
            if(!validateUserPassword){
                return next(new HttpError("Current password is incorrect.", 422))
            } 

            //compare new passwords
            if(newPassword !== confirmNewPassword){
                return next(new HttpError("New passwords do not match.", 422))
            }

            if(newPassword.length < 6){
                return next(new HttpError("New password must be at least 6 characters long.", 422))
            }

            //hash new password 
            const salt = await bcrypt.genSalt(10);  
            const hash = await bcrypt.hash(newPassword, salt);

            //update user info in database WITH new password
            const newInfo = await User.findByIdAndUpdate(
                req.user.id, 
                {name, email: newEmail, password: hash}, 
                {new: true}
            ).select('-password')
            
            return res.status(200).json(newInfo)
        } else {
            //update user info in database WITHOUT changing password
            const newInfo = await User.findByIdAndUpdate(
                req.user.id, 
                {name, email: newEmail}, 
                {new: true}
            ).select('-password')
            
            return res.status(200).json(newInfo)
        }
    }   
    catch(error){
        return next(new HttpError("User update failed.", 500))
    }
}

// =========================Get Authors==========================
// GET: api/users/
//Unprotected

const getAuthors = async(req,res,next)=>{
    try {
        const authors = await User.find().select('-password')
        res.json(authors)
    } catch (error) {
        return next(new HttpError(error))
    }
}

module.exports={registerUser,loginUser,getUser,changeAvatar, editUser, getAuthors}
