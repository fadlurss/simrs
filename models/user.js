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
        username: String,
        jenis_kelamin: String,
        tanggal_lahir: String,
        umur: String,
        id_agama: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tbl_agama'
        },
        status_menikah: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tbl_status_menikah'
        },
        id_pasien: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tbl_pasien'
        },
        alamat: String,
        pekerjaan: String,
        no_hp: String,
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