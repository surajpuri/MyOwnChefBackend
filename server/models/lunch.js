const mongoose = require('mongoose');
const lunchSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    foodItem: { type: String, required: true },
    lunchImage: { type: String },
    description: { type: String },
    howtomake: { type: String },
    benifits: { type: String},
    createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('lunch', lunchSchema);