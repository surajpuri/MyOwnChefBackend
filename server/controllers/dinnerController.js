const mongoose = require('mongoose');

const Ditem = require('../models/dinner');

exports.ditemController = (req, res, next) => {
    console.log(req.body);{
                
                
        if (req.files && req.files.dinnerImage) {
            var dinnerImage = req.files.dinnerImage;
            if (dinnerImage.truncated === true) {
                console.log("Maximum limit for file upload is 2mb.");
                return res.status(409).json({ message: "Maximum limit for file upload is 2mb." });
            }
            if (dinnerImage.mimetype == 'image/jpeg' || dinnerImage.mimetype == 'image/png'){
                filename = dinnerImage.name;
                uploadPath ='/uploads/dinner/' + Date.now() + '-' + filename.replace(/ /g, '-');;
                dinnerImage.mv(appRoot + uploadPath, function(err){
                    if(err){
                        console.log("Error while upload file.");
                        res.status(500).json({ 
                            message:"Error while upload file.",
                            err
                        });
                    }
                });
                dinnerImage = uploadPath;
            } else {
                console.log("File must be in jpeg or png format.");
                return res.status(409).json({
                    message: "File must be in jpeg or png format."
                });
            }
        }

                const newItem = new Ditem({
                    _id: new mongoose.Types.ObjectId,
                    foodItem: req.body.foodItem,
                    description: req.body.description,
                    howtomake: req.body.howtomake,
                    benifits: req.body.benifits,
                    dinnerImage: req.body.dinnerImage,
                    createdAt: Date.now(),
                });
                newItem
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({ message: "New Dinner item has been created successfully." });
                })
                
                
                };
            };
                
        
exports.getAllditem = (req, res, next) => {
    Ditem.find()
    .then(result => {
        if (result && result.length === 0)
            return res.status(404).json({ message: 'No items found.' });
        res.status(200).json({ result });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err.message });
    });
}



exports.deletedinnerController = (req, res, next) => {
    Ditem.findOne({ _id: req.params.id })
    .then(dinner => {
        if (dinner === null)
            return res.status(404).json({ message: 'Invalid dinner ID.' });
        Ditem.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Dinner item is succesfully deleted.' });
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


exports.editDinner = (req, res, next) => {
    Ditem.findOne({ _id: req.params.id })
    .then(dinner => {
        if (dinner === null)
            return res.status(404).json({ message: 'Invalid userId.' });
        var update = req.body;

        Ditem.updateOne(
            { _id: req.params.id },
            { $set: update }
        )
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Dinner is succesfully updated.' });
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
