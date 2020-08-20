const mongoose = require('mongoose');

const Litem = require('../models/lunch');

exports.litemController = (req, res, next) => {
    console.log(req.body);{
                
        if (req.files && req.files.lunchImage) {
            var lunchImage = req.files.lunchImage;
            if (lunchImage.truncated === true) {
                console.log("Maximum limit for file upload is 2mb.");
                return res.status(409).json({ message: "Maximum limit for file upload is 2mb." });
            }
            if (lunchImage.mimetype == 'image/jpeg' || lunchImage.mimetype == 'image/png'){
                filename = lunchImage.name;
                uploadPath ='/uploads/lunch/' + Date.now() + '-' + filename.replace(/ /g, '-');;
                lunchImage.mv(appRoot + uploadPath, function(err){
                    if(err){
                        console.log("Error while upload file.");
                        res.status(500).json({ 
                            message:"Error while upload file.",
                            err
                        });
                    }
                });
                lunchImage = uploadPath;
            } else {
                console.log("File must be in jpeg or png format.");
                return res.status(409).json({
                    message: "File must be in jpeg or png format."
                });
            }
        }        


                const newItem = new Litem({
                    _id: new mongoose.Types.ObjectId,
                    foodItem: req.body.foodItem,
                    description: req.body.description,
                    howtomake: req.body.howtomake,
                    benifits: req.body.benifits,
                    lunchImage: req.body.lunchImage,
                    createdAt: Date.now(),
                });
                newItem
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({ message: "New Lunch item has been created successfully." });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({ error : err.message });
                });
                
                };
            };
                
        
exports.getAlllitem = (req, res, next) => {
    Litem.find()
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

exports.deletelunchController = (req, res, next) => {
    Litem.findOne({ _id: req.params.id })
    .then(lunch => {
        if (lunch === null)
            return res.status(404).json({ message: 'Invalid breakfast ID.' });
        Litem.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Lunch item is succesfully deleted.' });
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

exports.editLunch = (req, res, next) => {
    Litem.findOne({ _id: req.params.id })
    .then(lunch => {
        if (lunch === null)
            return res.status(404).json({ message: 'Invalid userId.' });
        var update = req.body;

        Litem.updateOne(
            { _id: req.params.id },
            { $set: update }
        )
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Lunch is succesfully updated.' });
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
