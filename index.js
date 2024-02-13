const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');
const logoutRoute = require('./routes/logout');
const cookieParser = require('cookie-parser');
const ProfileRouter = require('./routes/profile')
const TaskRouter = require('./routes/task')
const path = require('path');



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'routes', 'static')));

app.set('view engine', 'ejs'); // Use 'set' method to set the view engine
app.set('views', path.join(__dirname, 'routes', 'template'));

// Use 'set' method to set the views directory
mongoose.set('strictQuery', false);

const { router: loginRouter, authenticateToken } = require('./routes/login');

app.use('/login', loginRouter);
app.use('/signup', signupRoute);
app.use('/logout', logoutRoute);
app.use('/profile', ProfileRouter);
app.use('/home/task',TaskRouter);

app.get('/home', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the home page!', user: req.user });
    
});

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://abdullahaliquadri:tiktak786@cluster0.fihugf0.mongodb.net/myclients?retryWrites=true&w=majority');
        app.listen(port, () => {
            console.log('Server has been started ' + port);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

start();
