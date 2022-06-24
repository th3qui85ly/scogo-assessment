const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number },
    password: { type: String, required: true },
    salt: { type: String },
})


module.exports = mongoose.model('User', UserSchema);
