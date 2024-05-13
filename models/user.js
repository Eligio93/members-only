const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true, minLength: 3 },
    lastName: { type: String, required: true, minLength: 3 },
    email: { type: String, required: true },
    password: { type: String, required: true, minLength: 4 },
    member: { type: Boolean, required: true },
    admin: { type: Boolean, required: true }
})

module.exports = mongoose.model('User', UserSchema)