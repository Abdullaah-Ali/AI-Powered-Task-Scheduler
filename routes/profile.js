
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const path = require('path');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./login');




const userProfileSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    occupation:{
        type:String,
        required:true
    },
    DOB:{
        type:Date,
        required:true
    }

})
const UserProfile = mongoose.model('UserProfile', userProfileSchema);

router.route('/')
  .get(authenticateToken,async(req, res) => {
    try {
      // Your logic for handling GET requests
      const useremail = req.user.email
      const userProfile = await UserProfile.findOne({email: useremail});
      if (!userProfile) {
        const alternativeprofile = {
           name: 'Your name',
           email: useremail,
           occupation: 'Your occupation',
           DOB: 'Your DOB' 
        }
        return res.render('profile', { userProfile: alternativeprofile });
          }
      res.render('profile',{userProfile})

      //res.sendFile(path.join(__dirname, '', 'template', 'profile.html'));
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');

    }

  })
  .post(authenticateToken,async (req, res) => {
    try {
      const { your_name, your_email, your_occupation, your_date_of } = req.body;
      const UserEmailFromToken = req.user.email
      //as when the req.user is decoded in the login file the params are save and hence we got to know the mail 

      const existingUser = await UserProfile.findOne({ email: UserEmailFromToken });


      if (existingUser) {
        // User exists, update the profile
        const updateFields = {};
        
        // Check which fields are present in the request body and update only those fields
        if (your_name) updateFields.name = your_name;
        if (your_email) updateFields.email = your_email;
        if (your_occupation) updateFields.occupation = your_occupation;
        if (your_date_of) updateFields.DOB = your_date_of;

        const updatedProfile = await UserProfile.findOneAndUpdate(
            { email: UserEmailFromToken },
            updateFields,
            { new: true }
        );
        return res.json(updatedProfile);
        


      } else {
        // User does not exist, create a new profile
        const newUserProfile = new UserProfile({
          name: your_name,
          email: your_email,
          occupation: your_occupation,
          DOB: your_date_of
        });
        await newUserProfile.save();
        return res.json(newUserProfile);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });


module.exports = router;