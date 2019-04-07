const express = require('express')
router = express.Router()
passport = require('passport')
User = require('../models/user')
Jadwal_dokter = require("../models/Tbl_jadwal_praktek_dokter")
Riwayat_diagnosa = require("../models/Tbl_riwayat_diagnosa")
Dokter = require("../models/Tbl_dokter")
Poliklinik = require("../models/Tbl_poliklinik")
Agama = require("../models/Tbl_agama")
Status_menikah = require("../models/Tbl_status_menikah")
Pasien = require("../models/Tbl_pasien")
async = require('async')
nodemailer = require('nodemailer')
crypto = require('crypto')
request = require("request")
multer = require("multer")
bcrypt = require('bcrypt-nodejs')
middleware = require("../middleware")
asyncMiddleware = require("../middleware")
var moment = require('moment');
var now = moment().toDate();

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

const imageFilter = function (req, file, cb) {
    //accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};


// show the home page (will also have our login links)
router.get('/', function (req, res) {
    res.redirect("/index");
});

router.get('/index', function (req, res) {
    res.render('v_access/index');
});

router.get('/pelayanan', function (req, res) {
    res.render('v_access/pelayanan');
});

router.get('/jadwaldokter', middleware.asyncMiddleware(async (req, res, next) => {
    const jadwaldokter = await Jadwal_dokter.find({}).populate("poliklinik").populate("nama_dokter");
    res.render('v_access/jadwaldokter', {
        jadwaldokter: jadwaldokter
    });
}));

router.get('/hubungikami', middleware.asyncMiddleware(async (req, res, next) => {
    res.render('v_access/kontak');
}));

// PROFILE SECTION =========================
router.get("/users/:id", middleware.isLoggedIn, middleware.asyncMiddleware(async (req, res, next) => {
    const agama = await Agama.find({});
    const data_user = await User.findById(req.params.id).populate("local.id_agama").populate("local.status_menikah");
    const data_riwayat_diagnosa = await Riwayat_diagnosa.find().where('id_user').equals(data_user._id);
    res.render("v_access/profile", {
        user: data_user,
        agama: agama,
        data_riwayat_diagnosa: data_riwayat_diagnosa
    })
}));

// LOGOUT ==============================
router.get('/logout', function (req, res) {
    req.logout();
    req.flash("success", "You successfull logout!"); // pertama dari sini, trs dikirim ke app.js, trs dikirim ke header
    res.redirect('/index');
});

// locally --------------------------------
// LOGIN ===============================
// show the login form
router.get('/login', function (req, res) {
    res.render("v_access/login", {
        message: req.flash('loginMessage')
    });
});

// process the login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/', //redirect to homepage campground
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

// SIGNUP =================================
// show the signup form

router.get('/jadwaldokter', middleware.asyncMiddleware(async (req, res, next) => {
    const jadwaldokter = await Jadwal_dokter.find({}).populate("poliklinik").populate("nama_dokter");
    res.render('v_access/jadwaldokter', {
        jadwaldokter: jadwaldokter
    });
}));

router.get('/signup', middleware.asyncMiddleware(async (req, res, next) => {
    // var start = await Pasien.find({
    //     no_rm
    // });
    // var end = start.no_rm;
    // console.log(start);

    var counter = await Pasien.find().count();
    const data_agama = await Agama.find({});
    const data_status_menikah = await Status_menikah.find({});
    res.render('v_access/signup', {
        data_agama: data_agama,
        data_status_menikah: data_status_menikah,
        counter: (counter + 1),
        message: req.flash('signupMessage')
    });
}));

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));




// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

// locally --------------------------------
router.get('/connect/local', function (req, res) {
    res.render('connect-local.ejs', {
        message: req.flash('loginMessage')
    });
});
router.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));



// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

// local -----------------------------------
router.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
        res.redirect('/profile');
    });
});




//FORGOT PASSWORD
router.get("/forgot", function (req, res) {
    res.render("v_access/forgot");
});

router.post('/forgot', function (req, res, next) {
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
                _id: req.user._id
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
                    user: 'fadlurss@gmail.com',
                    pass: process.env.GMAILPW
                }

            });
            var mailOptions = {
                to: user.local.email,
                from: 'fadlurss@gmail.com',
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
});


router.get('/reset/:token', function (req, res) {
    User.findOne({
        'local.resetPasswordToken': req.params.token,
        'local.resetPasswordExpires': {
            $gt: Date.now()
        }
    }, function (err, cari) {


        res.render("v_access/reset", {
            token: req.params.token
        });


        //   res.json({token: req.params.token});
        //   console.log("HASILNYA "+req.params.token);
    });
});
router.post('/updatepass', async (req, res) => {
    const user = await User.findOne({
        _id: "5bdebf5dbdb3f7cc8c0bd4af"
    })
    // user.local.password = bcrypt.hashSync("test", bcrypt.genSaltSync(8));
    // user.save()

    res.json(user)
    // $2a$08$u2zH3wIfqA.fo8ELOMkYe.1cTKoIWOrJVCmV/E40jYkY6z/3S8A4q
})
router.post('/reset/:token', function (req, res) {
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
                    user: 'fadlurss@gmail.com',
                    pass: process.env.GMAILPW // GMAILPW=your password in terminal node app.js
                }
            });

            var mailOptions = {
                to: user.local.email,
                from: 'fadlurss@gmail.com',
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
});


router.get("/verify", function (req, res) {
    res.render("v_access/verify", {
        message: req.flash('success')
    });
});

router.get('/verify/:tokenReg', function (req, res) {
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
});

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

module.exports = router;