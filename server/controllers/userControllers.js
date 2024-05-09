const bcrypt= require('bcryptjs')
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
// Post: api/users/:id
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
// Post: api/users/register
//Protected

const changeAvatar = async(req,res,next)=>{
    try {
        if(!req.files.avatar){
            return next(new HttpError("Please choose an image.", 422))
        }
        //find user from database
        const user = await User.findById(req.user.id)

        //delete old avatar if exists
        if(user.avatar){
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err)=>{
                if(err){
                    return next(new HttpError(err))
                }
            })
        }

        const {avatar} = req.files
        if (avatar.size>50000){
            return next(new HttpError("Profile picture too big. Should be less than 500kb"), 422)
        }

        let fileName;
        fileName=avatar.name
        let splittedFilename = fileName.split('.')
        let newFileName = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length -1]
        avatar.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) =>{
            if (err){
                return next(new HttpError(err))
            }

            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, {avatar:newFileName}, {new:true})
            if(!updatedAvatar){
                return next(new HttpError("Avatar couldn't be changed.", 422))
            }
            res.status(200).json(updatedAvatar)
        })
    } 
    catch (error) {
        return next(new HttpError(error))
    }
}


// =========================Edit User Details (from profile)==========================
// Post: api/users/edit-user
//Protected

const editUser = async(req,res,next)=>{
    try{
        const {name, email, currentPassword, newPassword, confirmNewPassword} = req.body;
        if(!name || !email || !currentPassword || !newPassword){
            return next(new HttpError("Fill in all fields.", 422))
        }

        //get user from database
        const user = await User.findById(req.user.id)
        if(!user){
            return next(new HttpError("User not found.", 403))
        }

        //make sure new email doesn't already exist
        const emailExist = await User.findOne({email})

        //we want to update ther details with/without changing the email(which is a unique id because we use it to login)
        if(emailExist && (emailExist._id != req.user.id)){
            return next(new HttpError("Email already exist.", 422))

        }

        //compare current password to db password 
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password)
        if(!validateUserPassword){
            return next(new HttpError("Invalid current password", 422))
        } 

        //compare new passwords
        if(newPassword!==confirmNewPassword){
            return next(new HttpError("New passwords do not match.", 422))
        }

        //hash new password 
        const salt = await bcrypt.genSalt(10);  
        const hash = await bcrypt.hash(newPassword, salt);

        //update user info in database
        const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password: hash}, {new: true})
        res.status(200).json(newInfo)

    }   
    catch(error){
        return next(new HttpError(error))
    }
}


// =========================Get Authors==========================
// Post: api/users/authors
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