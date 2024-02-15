
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const path = require('path');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./login');


router.get('/', (req, res) => {
    res.render(path.join(__dirname, 'template', 'task.ejs'));
    //display the ejs extension of the task page
}); 



module.exports = router;