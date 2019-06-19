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
    // req.flash('success', 'Berhasil login');

    res.redirect("/index");
};

exports.halaman_awal = function (req, res) {
    // req.flash('success', 'Your comment will reviewed in a moment in a hours');
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
    }).populate("id_dokter_penanggung_jawab").populate("id_poliklinik");
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
    req.flash("success", "Anda berhasil logout"); // pertama dari sini, trs dikirim ke app.js, trs dikirim ke header
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

exports.forgot_password = function (req, res) {
    res.render("v_access/forgot");
    console.log(req.user);

}

exports.post_forgot_password = function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({
                'local.email': req.body.email
            }, function (err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 7600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });

            var userData = {
                "local.resetPasswordToken": token,
                "local.resetPasswordExpires": Date.now() + 7600000
            }
            User.updateOne({
                'local.email': req.body.email
            }, {
                $set: userData
            }, function (err, hasil) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(hasil);
                }
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'jhieber7@gmail.com',
                    pass: 'xtcbandung97'
                }
            });
            var mailOptions = {
                to: user.local.email,
                from: 'jhieber7@gmail.com',
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/index');
    });
}

exports.reset_token = function (req, res) {
    User.findOne({
        'local.resetPasswordToken': req.params.token,
        'local.resetPasswordExpires': {
            $gt: Date.now()
        }
    }, function (err, cari) {
        res.render("v_access/reset", {
            token: req.params.token
        });
    });
}

exports.post_reset_token = function (req, res) {
    async.waterfall([
        function (done) {
            User.findOne({
                'local.resetPasswordToken': req.params.token
            }, function (err, user) {
                if (user == null) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                let hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
                user.local.password = hash
                user.local.resetPasswordToken = undefined;
                user.local.resetPasswordExpires = undefined;

                user.save(function (err, result) {
                    if (err) {
                        res.send(err)
                    } else {
                        res.redirect('/login')
                    }
                });
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'jhieber7@gmail.com',
                    pass: 'xtcbandung97' // GMAILPW=your password in terminal node app.js
                }
            });

            var mailOptions = {
                to: user.local.email,
                from: 'jhieber7@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello, \n\n' +
                    'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
            };

            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash("success", "Success! Your password has been changed");
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/login');
    });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}