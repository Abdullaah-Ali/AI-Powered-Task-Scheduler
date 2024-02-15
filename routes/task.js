
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const path = require('path');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./login');



const taskschema = new mongoose.Schema({
    projectName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    duedate:{
        type:Date,
        required:true
    }
    ,
    priority:{
        type:String,
        required:true
    }

})

const UserTasks = mongoose.model('UserTasks', taskschema);

router.get('/', authenticateToken,  (req, res) => {
        res.render(path.join(__dirname, 'template', 'task.ejs'));
    
    
}); 
    



module.exports = router;