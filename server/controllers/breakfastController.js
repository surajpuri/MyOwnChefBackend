const mongoose = require('mongoose');

const Bitem = require('../models/breakfast');

exports.bitemController = (req, res, next) => {
    console.log(req.body);{
                
        if (req.files && req.files.breakfastImage) {
            var breakfastImage = req.files.breakfastImage;
            if (breakfastImage.truncated === true) {
                console.log("Maximum limit for file upload is 2mb.");
                return res.status(409).json({ message: "Maximum limit for file upload is 2mb." });
            }
            if (breakfastImage.mimetype == 'image/jpeg' || breakfastImage.mimetype == 'image/png'){
                filename = breakfastImage.name;
                uploadPath ='/uploads/breakfast/' + Date.now() + '-' + filename.replace(/ /g, '-');;
                breakfastImage.mv(appRoot + uploadPath, function(err){
                    if(err){
                        console.log("Error while upload file.");
                        res.status(500).json({ 
                            message:"Error while upload file.",
                            err
                        });
                    }
                });
                breakfastImage = uploadPath;
            } else {
                console.log("File must be in jpeg or png format.");
                return res.status(409).json({
                    message: "File must be in jpeg or png format."
                });
            }
        }
                
                const newItem = new Bitem({
                    _id: new mongoose.Types.ObjectId,
                    foodItem: req.body.foodItem,
                    description: req.body.description,
                    howtomake: req.body.howtomake,
                    benifits: req.body.benifits,
                    breakfastImage: req.body.breakfastImage,
                    createdAt: Date.now(),
                });
                newItem
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({ message: "New Breakfast item has been created successfully." });
                })
                
                
                };
            };
                
        
exports.getAllbitem = (req, res, next) => {
    Bitem.find()
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



exports.deletebreakfastController = (req, res, next) => {
    Bitem.findOne({ _id: req.params.id })
    .then(breakfast => {
        if (breakfast === null)
            return res.status(404).json({ message: 'Invalid breakfast ID.' });
        Bitem.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Breakfast item is succesfully deleted.' });
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


exports.editBreakfast = (req, res, next) => {
    Bitem.findOne({ _id: req.params.id })
    .then(breakfast => {
        if (breakfast === null)
            return res.status(404).json({ message: 'Invalid userId.' });
        var update = req.body;

        Bitem.updateOne(
            { _id: req.params.id },
            { $set: update }
        )
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Breakfast is succesfully updated.' });
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
