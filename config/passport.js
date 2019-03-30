// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var jwt = require('jsonwebtoken');
var querystring = require('querystring');
var randomstring = require('randomstring');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

// load up the user model
var User = require('../models/user');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing
var config = require('./database');

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function () {
                User.findOne({
                    'local.email': email
                }, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'No user found.'));

                    if (!user.local.activeReg)
                        return done(null, false, req.flash('loginMessage', 'You must verify email address.'));


                    if (user.validPassword(password)) {
                        // return done(null, false, req.flash('loginMessage', 'Berhasil.'));
                        var token = jwt.sign({
                            id: user.local.id
                        }, config.secret, {
                            expiresIn: 86400 //expires in 24 hours
                        });
                        return done(null, user, req.flash('success', 'Welcome back to Klinik Dokter Kita, ' + user.local.email + ' This is your token ' + token));
                    } else {
                        return done(null, false, req.flash('loginMessage', 'Silakan isi kembali email dan password anda dengan benar'));
                    }

                });
            });

        }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, email, password, done) {

            String.prototype.capitalize = function () { //Mengganti firstname awal kata yang kecil menjadi besar
                return this.charAt(0).toUpperCase() + this.slice(1);
            }

            var firstName = req.body.firstName.capitalize();
            lastName = req.body.lastName.replace(/[^A-Za-z]/g, '').toLowerCase();
            username = req.body.username.split(" ").join("");
            jenis_kelamin = req.body.jenis_kelamin;
            tanggal_lahir = req.body.tanggal_lahir;
            umur = req.body.umur;
            agama = req.body.agama;
            status_menikah = req.body.status_menikah;
            alamat = req.body.alamat;
            pekerjaan = req.body.pekerjaan;
            no_hp = req.body.no_hp;


            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching


            // asynchronous
            process.nextTick(function () {
                // if the user is not already logged in:
                if (!req.user) {
                    req.checkBody('email', 'Invalid email format').notEmpty().isEmail();
                    req.checkBody('firstName', 'Invalid first name').notEmpty();
                    req.checkBody('lastName', 'Invalid last name').notEmpty();
                    req.checkBody('username', 'Invalid username').notEmpty();
                    req.checkBody('password', 'Invalid password, min password length is 8').notEmpty().isLength({
                        min: 8,
                        max: 100
                    });
                    var error = req.validationErrors();
                    if (error) {
                        var messages = [];
                        error.forEach(function (errors) {
                            messages.push(errors.msg);
                        });
                        return done(null, false, req.flash('signupMessage', messages));
                    }
                    User.findOne({
                        'local.email': email
                    }, function (err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that email
                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        } else {
                            var randomToken = randomstring.generate();

                            // create the user
                            var newUser = new User();
                            // eval(require('locus'))
                            if (req.body.adminCode === 'kode_admin') {
                                newUser.local.isAdmin = true;
                            }
                            if (req.body.dokterCode === 'kode_dokter') {
                                newUser.local.isDokter = true;
                            }
                            newUser.local.email = email;
                            newUser.local.firstName = firstName;
                            newUser.local.lastName = lastName;
                            newUser.local.username = username;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.local.tokenReg = randomToken;
                            newUser.local.jenis_kelamin = jenis_kelamin;
                            newUser.local.tanggal_lahir = tanggal_lahir;
                            newUser.local.umur = umur;
                            newUser.local.agama = agama;
                            newUser.local.status_menikah = status_menikah;
                            newUser.local.alamat = alamat;
                            newUser.local.pekerjaan = pekerjaan;
                            newUser.local.no_hp = no_hp;
                            newUser.local.activeReg = false;

                            //create a token
                            var token = jwt.sign({
                                id: newUser.local.id
                            }, config.secret, {
                                expiresIn: 86400 //expires in 24 hours
                            });

                            // req.flash('success', 'This is your token '+token);
                            // res.status(200).send({auth:true, token: token});

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser, req.flash('success', 'Selamat anda berhasil registrasi, silakan cek alamat email anda sekarang!'));
                            });

                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'fadlurss@gmail.com',
                                    pass: process.env.GMAILPW // GMAILPW=your password in terminal node app.js
                                }
                            });

                            var mailOptions = {
                                from: 'fadlurss@gmail.com',
                                to: newUser.local.email,
                                subject: 'Verify your email',
                                text: 'Hello, ' + newUser.local.username + '. Thank you for register Klinik Dokter Kita, please verify your token.\n\n' +
                                    'Click on the following link http://' + req.headers.host + '/verify/' + newUser.local.tokenReg
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });


                        }

                    });
                    // if the user is logged in but has no local account...
                } else if (!req.user.local.email) {
                    // ...presumably they're trying to connect a local account
                    // BUT let's check if the email used to connect a local account is being used by another user
                    User.findOne({
                        'local.email': email
                    }, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                            // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                        } else {
                            var user = req.user;
                            eval(require('locus'))
                            user.local.email = email;
                            user.local.firstName = firstName;
                            user.local.password = user.generateHash(password);
                            user.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }
                    });
                } else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user);
                }

            });

        }));



    function accountExists(email) {
        User.findOne({
            'local.email': email
        }, function (err, user) {
            var emails = user;
            console.log(emails);
            // var emails = ['you@email.com', 'alex@email.com', 'admin@email.com'];
            return emails.indexOf(email) > -1;
        });
    }


    var server = function (req, res) {
        var params = req.url.split('?')[1];
        var data = querystring.parse(params);
        var email = data.email;

        if (accountExists(email)) {
            res.write('"');
        } else {
            res.write('"true"');
        }
    };



};