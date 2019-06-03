const express = require('express')
router = express.Router()
passport = require('passport')
User = require('../models/user')
Pasien = require('../models/Tbl_pasien')
Jadwal_dokter = require("../models/Tbl_jadwal_praktek_dokter")
Riwayat_diagnosa = require("../models/Tbl_riwayat_diagnosa") //Riwayat diagnosa pakar
Riwayat_dokter = require("../models/Tbl_riwayatdiagnosa") //Riwayat dokter
Dokter = require("../models/Tbl_dokter")
Poliklinik = require("../models/Tbl_poliklinik")
Agama = require("../models/Tbl_agama")
Status_menikah = require("../models/Tbl_status_menikah")
Pendaftaran = require("../models/Tbl_pendaftaran")
async = require('async')
nodemailer = require('nodemailer')
crypto = require('crypto')
request = require("request")
multer = require("multer")
bcrypt = require('bcrypt-nodejs')
middleware = require("../middleware")
asyncMiddleware = require("../middleware")

exports.redirect_halaman_awal = function (req, res) {
    res.redirect("/index");
};

exports.halaman_awal = function (req, res) {
    res.render('v_access/index');
};

exports.pelayanan = function (req, res) {
    res.render('v_access/pelayanan');
}

exports.jadwal_dokter = middleware.asyncMiddleware(async (req, res, next) => {
    const jadwaldokter = await Jadwal_dokter.find({}).populate("poliklinik").populate("nama_dokter");
    res.render('v_access/jadwaldokter', {
        jadwaldokter: jadwaldokter
    });
})

exports.hubungi_kami = middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_access/kontak');
})

exports.get_user = middleware.asyncMiddleware(async (req, res, next) => {
    const data_user = await User.findById(req.params.id);
    const data_pasien = await Pasien.findOne({
        id_users: req.user._id
    });
    const data_riwayat_diagnosa = await Riwayat_diagnosa.find({
        id_pasien: data_pasien._id
    });
    const dada = await Pendaftaran.find({}).populate(
        "id_pasien",
        null, {
            id_users: req.user._id
        }
    ).populate({
        path: "id_riwayatdiagnosa",
        populate: {
            path: "id_riwayat_periksa_lab"
        }
    }).populate({
        path: "id_riwayattindakan",
        populate: {
            path: "id_tindakan"
        }
    });
    data_antrian = [];
    for (var i = 0; i < dada.length; i++) {
        if (dada[i].id_pasien != null) {
            data_antrian[i] = dada[i];
        }
    }

    res.render("v_access/profil", {
        user: data_user,
        data_antrian: data_antrian,
        data_pasien: data_pasien,
        data_riwayat_diagnosa: data_riwayat_diagnosa
    })
})

exports.logout = function (req, res) {
    req.logout();
    req.flash("success", "You successfull logout!"); // pertama dari sini, trs dikirim ke app.js, trs dikirim ke header
    res.redirect('/index');
}

exports.login = function (req, res) {
    res.render("v_access/login", {
        message: req.flash('loginMessage')
    });
}

exports.post_login = passport.authenticate('local-login', {
    successRedirect: '/', //redirect to homepage campground
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
})

exports.login_petugas = function (req, res) {
    res.render("v_access/loginpetugas", {
        message: req.flash('loginMessage')
    });
}

exports.post_login_petugas = passport.authenticate('local-login', {
    successRedirect: '/pendaftaran', //redirect to homepage campground
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true, // allow flash messages
})

exports.signup = middleware.asyncMiddleware(async (req, res, next) => {
    var counter = await Pasien.find().count();
    const data_agama = await Agama.find({});
    const data_status_menikah = await Status_menikah.find({});
    res.render('v_access/signup', {
        data_agama: data_agama,
        data_status_menikah: data_status_menikah,
        counter: (counter + 1),
        message: req.flash('signupMessage')
    });
})

exports.post_signup = passport.authenticate('local-signup', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
})

exports.verify = function (req, res) {
    res.render("v_access/verify", {
        message: req.flash('success')
    });
}

exports.post_verify = function (req, res) {
    User.findOne({
        'local.tokenReg': req.params.tokenReg
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            if (!result) {
                console.log(result);
                res.send("user not found");
            } else {
                // eval(require('locus'));
                result.local.activeReg = true;
                result.tokenReg = '';
                result.save();
                req.flash("success", "You successfull verify email!");
                res.redirect("/index");
                console.log(result.active);
            }
        }
    });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}