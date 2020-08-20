const mongoose = require('mongoose');
const breakfastSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    foodItem: { type: String, required: true },
    breakfastImage: { type: String },
    description: { type: String },
    howtomake: { type: String },
    benifits: { type: String},
    createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('breakfast', breakfastSchema);