const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signupController = (req, res, next) => {
    console.log(req.body);
    User.findOne({ email: req.body.email.toLowerCase() }, (err, data) => {
        if (err)
            return res.status(500).json({ error: err.message });
        else {
            if (data !== null)
                return res.status(409).json({ message:'Mail already exists.' });
            else {
                if (req.files && req.files.userImage) {
                    var userImage = req.files.userImage;
                    if (userImage.truncated === true) {
                        console.log("Maximum limit for file upload is 2mb.");
                        return res.status(409).json({ message: "Maximum limit for file upload is 2mb." });
                    }
                    if (userImage.mimetype == 'image/jpeg' || userImage.mimetype == 'image/png'){
                        filename = userImage.name;
                        uploadPath ='/uploads/user/' + Date.now() + '-' + filename.replace(/ /g, '-');;
                        userImage.mv(appRoot + uploadPath, function(err){
                            if(err){
                                console.log("Error while upload file.");
                                res.status(500).json({ 
                                    message:"Error while upload file.",
                                    err
                                });
                            }
                        });
                        userImage = uploadPath;
                    } else {
                        console.log("File must be in jpeg or png format.");
                        return res.status(409).json({
                            message: "File must be in jpeg or png format."
                        });
                    }
                }
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.password, salt);
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId,
                    fullName: req.body.fullName,
                    email: req.body.email.toLowerCase(),
                    password: hash,
                    status: true,
                    role: 'user',
                    gender: req.body.gender,
                    dateofBirth: req.body.dateofBirth,
                    address: req.body.address,
                    mobileNumber: req.body.mobileNumber,
                    userImage: userImage,
                    createdAt: Date.now(),
                });
                newUser
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({ message: "User has been created successfully." });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({ error : err.message });
                });
            }
        }
    });
}

exports.loginController = (req, res, next) => {
    User.findOne({ email: req.body.email.toLowerCase() })
    .exec()
    .then(user => {
        if (user === null)
            return res.status(401).json({ message: 'Auth Failed' });
        else if(!user.status)
            return res.status(401).json({ message : 'Your account has been blocked by admin.' });
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err)
                    return res.status(401).json({ message: 'Auth Failed' });
                else if (result) {
                    const token = jwt.sign({
                        userId: user._id,
                        email: user.email,
                        role: user.role,
                        status: user.status
                    },
                    process.env.secret_key, {
                        expiresIn: process.env.token_expires_in
                    });
                    const refreshToken = jwt.sign({
                        userId: user._id,
                        email: user.email,
                        role: user.role,
                        status: user.status
                    },
                    process.env.refresh_token_secret_key, {
                        expiresIn: process.env.token_expires_in
                    });
                    res.setHeader('authorization', token);
                    res.setHeader('refreshtoken', refreshToken);
                    return res.status(200).json({ message: 'Auth Successful.' })
                }
                res.status(401).json({ message: 'Auth Failed' });
            });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({ error : err.message });
    });
}

exports.getAllUser = (req, res, next) => {
    User.find()
    .then(result => {
        if (result && result.length === 0)
            return res.status(404).json({ message: 'No user found.' });
        res.status(200).json({ result });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err.message });
    });
}

exports.editUserController = (req, res, next) => {
    User.findOne({ _id: req.params.id })
    .then(user => {
        if (user === null)
            return res.status(404).json({ message: 'Invalid userId.' });
        var update = req.body;
        if (req.files && req.files.userImage) {
            const userImage = req.files.userImage;
            if (userImage.truncated === true) {
                console.log("Maximum limit for file upload is 2mb.");
                return res.status(409).json({ message: "Maximum limit for file upload is 2mb." });
            }
            if (userImage.mimetype == 'image/jpeg' || userImage.mimetype == 'image/png'){
                filename = userImage.name;
                uploadPath ='/uploads/user/' + Date.now() + '-' + filename.replace(/ /g, '-');;
                userImage.mv(appRoot + uploadPath, function(err){
                    if(err){
                        console.log("Error while upload file.");
                        res.status(500).json({ 
                            message:"Error while upload file.",
                            err
                        });
                    }
                });
                update.userImage = uploadPath;
            } else {
                console.log("File must be in jpeg or png format.");
                return res.status(409).json({
                    message: "File must be in jpeg or png format."
                });
            }
        }

        User.updateOne(
            { _id: req.params.id },
            { $set: update }
        )
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'User is succesfully updated.' });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({ error : err.message });
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({ error : err.message });
    });
}

exports.deleteUserController = (req, res, next) => {
    User.findOne({ _id: req.params.id })
    .then(user => {
        if (user === null)
            return res.status(404).json({ message: 'Invalid userId.' });
        User.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'User is succesfully deleted.' });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({ error : err.message });
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({ error : err.message });
    });
}