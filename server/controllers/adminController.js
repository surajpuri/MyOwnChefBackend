const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');

exports.signupController = (req, res, next) => {
    console.log(req.body);
    Admin.findOne({ email: req.body.email.toLowerCase() }, (err, data) => {
        if (err)
            return res.status(500).json({ error: err.message });
        else {
            if (data !== null)
                return res.status(409).json({ message:'Mail already exists.' });
            else {
                if (req.files && req.files.adminImage) {
                    var adminImage = req.files.adminImage;
                    if (adminImage.truncated === true) {
                        console.log("Maximum limit for file upload is 2mb.");
                        return res.status(409).json({ message: "Maximum limit for file upload is 2mb." });
                    }
                    if (adminImage.mimetype == 'image/jpeg' || adminImage.mimetype == 'image/png'){
                        filename = adminImage.name;
                        uploadPath ='/uploads/admin/' + Date.now() + '-' + filename.replace(/ /g, '-');;
                        adminImage.mv(appRoot + uploadPath, function(err){
                            if(err){
                                console.log("Error while upload file.");
                                res.status(500).json({ 
                                    message:"Error while upload file.",
                                    err
                                });
                            }
                        });
                        adminImage = uploadPath;
                    } else {
                        console.log("File must be in jpeg or png format.");
                        return res.status(409).json({
                            message: "File must be in jpeg or png format."
                        });
                    }
                }
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.password, salt);
                const newAdmin = new Admin({
                    _id: new mongoose.Types.ObjectId,
                    fullName: req.body.fullName,
                    email: req.body.email.toLowerCase(),
                    password: hash,
                    status: true,
                    role: 'admin',
                    mobileNumber: req.body.mobileNumber,
                    gender: req.body.gender,
                    dateofBirth: req.body.dateofBirth,
                    address: req.body.address,
                    adminImage: adminImage,
                    createdAt: Date.now(),
                });
                newAdmin
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({ message: "Admin has been created successfully." });
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
    Admin.findOne({ email: req.body.email.toLowerCase() })
    .exec()
    .then(admin => {
        if (admin === null)
            return res.status(401).json({ message: 'Auth Failed' });
        else if(!admin.status)
            return res.status(401).json({ message : 'Your account has been blocked by admin.' });
            bcrypt.compare(req.body.password, admin.password, (err, result) => {
                if(err)
                    return res.status(401).json({ message: 'Auth Failed' });
                else if (result) {
                    const token = jwt.sign({
                        userId: admin._id,
                        email: admin.email,
                        role: admin.role,
                        status: admin.status
                    },
                    process.env.secret_key, {
                        expiresIn: process.env.token_expires_in
                    });
                    const refreshToken = jwt.sign({
                        userId: admin._id,
                        email: admin.email,
                        role: admin.role,
                        status: admin.status
                    },
                    process.env.refresh_token_secret_key, {
                        expiresIn: process.env.token_expires_in
                    });
                    res.setHeader('authorization', token)
                    res.setHeader('refreshtoken', refreshToken)
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
    Admin.find()
    .then(result => {
        if (result && result.length === 0)
            return res.status(404).json({ message: 'No Admin users found.' });
        res.status(200).json({ result });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err.message });
    });
}

exports.editAdminController = (req, res, next) => {
    Admin.findOne({ _id: req.params.id })
    .then(admin => {
        if (admin === null)
            return res.status(404).json({ message: 'Invalid userId.' });
        var update = req.body;
        if (req.files && req.files.adminImage) {
            const adminImage = req.files.adminImage;
            if (adminImage.truncated === true) {
                console.log("Maximum limit for file upload is 2mb.");
                return res.status(409).json({ message: "Maximum limit for file upload is 2mb." });
            }
            if (adminImage.mimetype == 'image/jpeg' || adminImage.mimetype == 'image/png'){
                filename = adminImage.name;
                uploadPath ='/uploads/user/' + Date.now() + '-' + filename.replace(/ /g, '-');;
                adminImage.mv(appRoot + uploadPath, function(err){
                    if(err){
                        console.log("Error while upload file.");
                        res.status(500).json({ 
                            message:"Error while upload file.",
                            err
                        });
                    }
                });
                update.adminImage = uploadPath;
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
            res.status(200).json({ message: 'Admin is succesfully updated.' });
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

exports.deleteAdminController = (req, res, next) => {
    Admin.findOne({ _id: req.params.id })
    .then(admin => {
        if (admin === null)
            return res.status(404).json({ message: 'Invalid userId.' });
        Admin.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Admin is succesfully deleted.' });
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