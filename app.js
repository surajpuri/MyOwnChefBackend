const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');
global.appRoot = path.resolve(__dirname);
const { mongoUrl } = require('./server/config/db');
const adminRoutes = require('./server/routes/adminRoutes')
const userRoutes = require('./server/routes/userRoutes');
const breakfastRoutes = require('./server/routes/breakfastRoutes');
const lunchRoutes = require('./server/routes/lunchRoutes');
const dinnerRoutes = require('./server/routes/dinnerRoutes');


mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

app.use(morgan('dev')); //logging all requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use(fileUpload({ limits: { fileSize: 20 * 1024 * 1024 } }));

//header for handling CORS Error
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/breakfast', breakfastRoutes);
app.use('/api/lunch', lunchRoutes);
app.use('/api/dinner', dinnerRoutes);


app.use((req, res, next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
   res.status(error.status || 500);
   res.json({
        message : error.message
   });
   console.log(error);
});

module.exports = app;