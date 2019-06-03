var express = require('express')
router = express.Router()
User = require("../models/user")
Notification = require("../models/notification")


//lihat semua notifikasi
exports.notifications = middleware.asyncMiddleware(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate({
        path: "notification",
        option: {
            sort: {
                "_id": -1
            }
        }
    }).exec();
    const allnotif = user.notification;
    res.render("notifications/index", {
        allnotif
    });
});

exports.detail_notifikasi = middleware.asyncMiddleware(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id, async (err, hasilnya) => {
        hasilnya.isRead = true;
        hasilnya.save();
        res.redirect(`/pendaftaran/${hasilnya.pendaftaran_id}/detail`);
    })
});