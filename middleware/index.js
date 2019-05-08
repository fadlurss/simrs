var Users = require("../models/user")
var jwt = require('jsonwebtoken')
config = require('../config/database')
middlewareObj = {};

middlewareObj.Dokter = function (req, res, next) {
    if (req.isAuthenticated()) {
        Users.findById(req.params.id, function (err, foundUsers) {
            if (req.user.local.level === "Dokter") {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.Admin = function (req, res, next) {
    if (req.isAuthenticated()) {
        Users.findById(req.params.id, function (err, foundUsers) {
            if (req.user.local.level === "Admin") {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.Petugas = function (req, res, next) {
    if (req.isAuthenticated()) {
        Users.findById(req.params.id, function (err, foundUsers) {
            if (req.user.local.level === "Petugas") {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.DokterdanPetugas = function (req, res, next) {
    if (req.isAuthenticated()) {
        Users.findById(req.params.id, function (err, foundUsers) {
            if (req.user.local.level === "Petugas" || req.user.local.level === "Dokter") {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } // else
    req.flash("error", "You need to be logged in to do that"); // pertama dari sini, trs ke app.js trs ke header
    res.redirect("/index");
}

middlewareObj.asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };

module.exports = middlewareObj;