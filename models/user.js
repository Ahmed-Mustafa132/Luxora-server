const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: 'Invalid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role : {
        type: String,
        enum: ['user','receptionist','admin'],
        default: 'user'
    },
})

const User = mongoose.model('User', userSchema);
module.exports = User;
