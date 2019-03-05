// load the things we need
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local: {
        id: String,
        email: {
            type: String,
            unique: true
        },
        firstName: String,
        lastName: String,
        username: {
            type: String,
            unique: true
        },
        password: String,
        isAdmin: {
            type: Boolean,
            default: false
        },
        isDokter: {
            type: Boolean,
            default: false
        },
        resetPasswordToken: {
            type: String,
            default: null
        },
        resetPasswordExpires: {
            type: Date,
            default: Date.Now
        },
        tokenReg: String,
        activeReg: Boolean,
        statusAkun: {
            type: Boolean,
            default: false
        },
        image_ktp: String,
        image_ktp_selfie: String
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: {
            type: String,
            unique: true
        }
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: {
            type: String,
            unique: true
        },
        name: String
    }

});

// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    // console.log(bcrypt.compareSync(password, this.local.password));
    return bcrypt.compareSync(password, this.local.password)
};

userSchema.plugin(passportLocalMongoose);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);