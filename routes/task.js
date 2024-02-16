
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
    },
    
    usermail:{
        type:String,
        required:true
    },

    priority:{
        type:String,
        required:true
    }

})

const UserTasks = mongoose.model('UserTasks', taskschema);


router.route('/')
.get(authenticateToken, async (req, res) => {
    try {
        const userEmail = req.user.email; // Extract user email from JWT payload
        const userTasks = await UserTasks.find({ usermail: userEmail });
        res.render('task', { tasksData: JSON.stringify(userTasks) }); // Pass tasks data to the view
        //console.log(userTasks)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
.post(authenticateToken, async (req, res) => {
    try {
        const { priority, project_name, description, due_date } = req.body;
        const userEmail = req.user.email; // Extract user email from JWT payload

        const existingTask = await UserTasks.findOne({ userEmail });

        if (existingTask) {
            // Task exists, update the task
            const updateFields = {};

            // Check which fields are present in the request body and update only those fields
            if (project_name) updateFields.projectName = project_name;
            if (description) updateFields.description = description;
            if (priority) updateFields.priority = priority;
            if (due_date) updateFields.duedate = due_date;

            const updatedTask = await UserTasks.findOneAndUpdate(
                { usermail },
                updateFields,
                { new: true }
            );
            res.redirect('/home/task');

            //res.json(updatedTask);
        } else {
            // Task does not exist, create a new task
            const newTask = new UserTasks({
                projectName: project_name,
                priority: priority,
                description: description,
                duedate: due_date,
                usermail: userEmail // Associate the task with the user's email
            });

            const savedTask = await newTask.save();
            res.redirect('/home/task');
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;