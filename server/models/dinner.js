const mongoose = require('mongoose');
const dinnerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    foodItem: { type: String, required: true },
    dinnerImage: { type: String },
    description: { type: String },
    howtomake: { type: String },
    benifits: { type: String},
    createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('dinner', dinnerSchema);