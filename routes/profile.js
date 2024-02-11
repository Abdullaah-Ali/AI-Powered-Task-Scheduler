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
      res.sendFile(path.join(__dirname, '', 'template', 'profile.html'));
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
      if (UserEmailFromToken !== your_email) {
        return res.json({success: false});
    }
      const userProfile = new UserProfile({
        name: your_name,
        email: your_email,
        occupation: your_occupation,
        DOB: your_date_of
      });
      await userProfile.save()
      return res.json({success: true});


      //console.log(your_name);
      // Your logic for handling POST requests

      // Redirect user to home page
      res.redirect('/home');

    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });


module.exports = router;