const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName: { type: String, required: true },
    email: {
        type: String, 
        required: true, 
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/  //email regex
    },
    password: { type: String, required: true },
    role: { type: String, required: true },
    status : { type: Boolean, required: true },
    gender: { type: String },
    dateofBirth: { type: Date },
    address: { type: String },
    mobileNumber: { type: String },
    phoneNumber: { type: String },
    userImage: { type: String },
    createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('user', userSchema);