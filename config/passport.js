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
                        return done(null, false, req.flash('loginMessage', 'Gagal.'));
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

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    var fbStrategy = configAuth.facebookAuth;
    fbStrategy.passReqToCallback = true; // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    passport.use(new FacebookStrategy(fbStrategy,
        function (req, token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function () {

                // check if the user is already logged in
                if (!req.user) {

                    User.findOne({
                        'facebook.id': profile.id
                    }, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.facebook.token) {
                                user.facebook.token = token;
                                user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                                user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                                user.save(function (err) {
                                    if (err)
                                        return done(err);

                                    return done(null, user);
                                });
                            }

                            return done(null, user, req.flash('success', 'Welcome back to Klinik Dokter Kita, ' + user.facebook.name)); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser = new User();

                            newUser.facebook.id = profile.id;
                            newUser.facebook.token = token;
                            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                            newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser, req.flash('success', 'Welcome back to Yelpcamp, ' + newUser.facebook.name));
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.facebook.id = profile.id;
                    user.facebook.token = token;
                    user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                    user.save(function (err) {
                        if (err)
                            return done(err);

                        return done(null, user, req.flash('success', 'Welcome back to Yelpcamp, ' + user.facebook.name));
                    });

                }
            });

        }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

            consumerKey: configAuth.twitterAuth.consumerKey,
            consumerSecret: configAuth.twitterAuth.consumerSecret,
            callbackURL: configAuth.twitterAuth.callbackURL,
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function (req, token, tokenSecret, profile, done) {

            // asynchronous
            process.nextTick(function () {

                // check if the user is already logged in
                if (!req.user) {

                    User.findOne({
                        'twitter.id': profile.id
                    }, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.twitter.token) {
                                user.twitter.token = token;
                                user.twitter.username = profile.username;
                                user.twitter.displayName = profile.displayName;

                                user.save(function (err) {
                                    if (err)
                                        return done(err);

                                    return done(null, user);
                                });
                            }

                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            var newUser = new User();

                            newUser.twitter.id = profile.id;
                            newUser.twitter.token = token;
                            newUser.twitter.username = profile.username;
                            newUser.twitter.displayName = profile.displayName;

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.twitter.id = profile.id;
                    user.twitter.token = token;
                    user.twitter.username = profile.username;
                    user.twitter.displayName = profile.displayName;

                    user.save(function (err) {
                        if (err)
                            return done(err);

                        return done(null, user);
                    });
                }

            });

        }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function (req, token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function () {

                // check if the user is already logged in
                if (!req.user) {

                    User.findOne({
                        'google.id': profile.id
                    }, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.google.token) {
                                user.google.token = token;
                                user.google.name = profile.displayName;
                                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                                user.save(function (err) {
                                    if (err)
                                        return done(err);

                                    return done(null, user);
                                });
                            }

                            return done(null, user, req.flash('success', 'Welcome back to Yelpcamp, ' + user.google.name));
                        } else {
                            var newUser = new User();

                            newUser.google.id = profile.id;
                            newUser.google.token = token;
                            newUser.google.name = profile.displayName;
                            newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser, req.flash('success', 'Welcome back to Yelpcamp, ' + newUser.google.name));
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.google.id = profile.id;
                    user.google.token = token;
                    user.google.name = profile.displayName;
                    user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                    user.save(function (err) {
                        if (err)
                            return done(err);

                        return done(null, user, req.flash('success', 'Welcome back to Yelpcamp, ' + user.google.name));
                    });

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